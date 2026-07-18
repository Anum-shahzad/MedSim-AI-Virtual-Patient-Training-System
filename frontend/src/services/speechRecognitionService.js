/**
 * speechRecognitionService.js
 *
 * Low-level singleton wrapper around the Web Speech API SpeechRecognition.
 * Handles the Electron/Chromium quirks:
 *   - Uses webkitSpeechRecognition fallback (Chromium ships it prefixed)
 *   - Keeps recognition alive indefinitely via auto-restart on `onend`
 *     (the API stops after ~5-7s of silence unless restarted)
 *   - De-duplicates transcript chunks to prevent repeated phrases
 *
 * This module is intentionally framework-agnostic (no React).
 * The React hook (useSpeechRecognition.js) wraps this for component use.
 */

// ── Browser API Detection ───────────────────────────────────────────────────

const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

/**
 * Returns true if SpeechRecognition is available in this environment.
 * @returns {boolean}
 */
export function isSpeechRecognitionSupported() {
  return SpeechRecognitionAPI !== null;
}

// ── Service Factory ─────────────────────────────────────────────────────────

/**
 * Creates a managed speech recognition session.
 *
 * The returned controller handles:
 *   - continuous recognition with manual stop
 *   - interim + final transcript accumulation
 *   - auto-restart when the browser stops recognition after silence
 *   - clean teardown on stop/cancel
 *
 * @param {object}   callbacks
 * @param {function} callbacks.onTranscriptChange  — (fullTranscript: string) => void
 * @param {function} callbacks.onError             — (errorMsg: string) => void
 * @param {function} [callbacks.onStarted]         — () => void, fired when mic opens
 * @returns {{ start: function, stop: function, cancel: function }}
 */
export function createRecognitionSession({ onTranscriptChange, onError, onStarted }) {
  if (!isSpeechRecognitionSupported()) {
    console.warn('[speechRecognitionService] SpeechRecognition not supported.');
    return null;
  }

  // ── Internal state ────────────────────────────────────────────────────────

  /** All finalized text segments joined together. */
  let finalTranscript = '';

  /** The interim (in-progress) text from the current recognition pass. */
  let interimTranscript = '';

  /**
   * Whether the user has intentionally stopped recording.
   * When true, the onend auto-restart is suppressed.
   */
  let intentionallyStopped = false;

  /**
   * Whether a recognition instance is currently active (started but not ended).
   * Prevents double-starting.
   */
  let isRunning = false;

  // ── SpeechRecognition instance ────────────────────────────────────────────

  const recognition = new SpeechRecognitionAPI();

  recognition.continuous      = true;  // Don't stop after first pause
  recognition.interimResults  = true;  // Get live partial results
  recognition.lang            = 'en-US';
  recognition.maxAlternatives = 1;

  // ── Event handlers ────────────────────────────────────────────────────────

  recognition.onstart = () => {
    isRunning = true;
    if (typeof onStarted === 'function') onStarted();
  };

  recognition.onresult = (event) => {
    interimTranscript = '';

    // Iterate only new results (from event.resultIndex to avoid reprocessing)
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        // Append finalized segment — add a space separator if needed
        const trimmed = text.trim();
        if (trimmed) {
          finalTranscript += (finalTranscript ? ' ' : '') + trimmed;
        }
      } else {
        // Accumulate interim text for live display
        interimTranscript += text;
      }
    }

    // Emit the combined transcript (final + current interim)
    const combined = finalTranscript
      + (interimTranscript ? (finalTranscript ? ' ' : '') + interimTranscript : '');

    onTranscriptChange(combined);
  };

  recognition.onerror = (event) => {
    // 'aborted' and 'no-speech' are not real errors — ignore them
    if (event.error === 'aborted' || event.error === 'no-speech') return;

    console.error('[speechRecognitionService] Error:', event.error);

    const messages = {
      'not-allowed':     'Microphone permission denied. Please allow mic access.',
      'audio-capture':   'No microphone found. Please connect a microphone.',
      'network':         'Network error during speech recognition.',
      'service-not-allowed': 'Speech recognition not allowed in this context.',
    };

    onError(messages[event.error] || `Recognition error: ${event.error}`);
  };

  recognition.onend = () => {
    isRunning = false;

    // Auto-restart UNLESS the user intentionally stopped
    // This keeps recording alive past the browser's natural silence timeout
    if (!intentionallyStopped) {
      try {
        recognition.start();
      } catch (e) {
        // Silently ignore "already started" race conditions
      }
    }
  };

  // ── Public API ────────────────────────────────────────────────────────────

  return {
    /**
     * Starts continuous speech recognition.
     */
    start() {
      intentionallyStopped = false;
      finalTranscript      = '';
      interimTranscript    = '';
      isRunning            = false;

      try {
        recognition.start();
      } catch (e) {
        console.error('[speechRecognitionService] Failed to start:', e);
        onError('Could not start speech recognition.');
      }
    },

    /**
     * Stops recognition and returns the finalized transcript.
     * Triggers onTranscriptChange one final time with cleaned text.
     * @returns {string} The complete transcript
     */
    stop() {
      intentionallyStopped = true;

      // Merge any remaining interim text into final before stopping
      if (interimTranscript.trim()) {
        finalTranscript += (finalTranscript ? ' ' : '') + interimTranscript.trim();
        interimTranscript = '';
      }

      try {
        recognition.stop();
      } catch (e) { /* ignore */ }

      onTranscriptChange(finalTranscript);
      return finalTranscript;
    },

    /**
     * Cancels recognition and discards all transcript data.
     */
    cancel() {
      intentionallyStopped = true;
      finalTranscript      = '';
      interimTranscript    = '';

      try {
        recognition.abort();
      } catch (e) { /* ignore */ }

      onTranscriptChange('');
    },
  };
}
