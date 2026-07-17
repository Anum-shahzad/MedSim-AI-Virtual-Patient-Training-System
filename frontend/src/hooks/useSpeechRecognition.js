/**
 * useSpeechRecognition.js
 *
 * React hook that wraps speechRecognitionService into a clean, stateful API
 * for use inside React components.
 *
 * Exposes:
 *   - isSupported    — whether the browser supports speech recognition
 *   - isRecording    — true while the mic is active
 *   - transcript     — live updating text (interim + final combined)
 *   - error          — error message string or null
 *   - startRecording — begin a new session (resets transcript)
 *   - stopRecording  — stop and return the final transcript string
 *   - cancelRecording — stop and discard transcript
 *
 * Guarantees:
 *   - Only one recognition session active at a time
 *   - Full cleanup on component unmount (no memory leaks)
 *   - Safe to call stop/cancel even if not currently recording
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  createRecognitionSession,
  isSpeechRecognitionSupported,
} from '../services/speechRecognitionService';

/**
 * @returns {{
 *   isSupported: boolean,
 *   isRecording: boolean,
 *   transcript: string,
 *   error: string|null,
 *   startRecording: function,
 *   stopRecording: function,
 *   cancelRecording: function,
 * }}
 */
export function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript,  setTranscript]  = useState('');
  const [error,       setError]       = useState(null);

  /** Ref holds the active session controller so we can call stop/cancel imperatively. */
  const sessionRef = useRef(null);

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // If the component unmounts mid-recording, cancel cleanly
      if (sessionRef.current) {
        sessionRef.current.cancel();
        sessionRef.current = null;
      }
    };
  }, []);

  // ── startRecording ──────────────────────────────────────────────────────
  const startRecording = useCallback(() => {
    // Prevent double-starting
    if (sessionRef.current) return;

    setError(null);
    setTranscript('');

    const session = createRecognitionSession({
      onTranscriptChange: (text) => {
        setTranscript(text);
      },
      onError: (msg) => {
        setError(msg);
        setIsRecording(false);
        sessionRef.current = null;
      },
      onStarted: () => {
        setIsRecording(true);
      },
    });

    if (!session) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    sessionRef.current = session;
    session.start();
  }, []);

  // ── stopRecording ───────────────────────────────────────────────────────
  /**
   * Stops recording and returns the final transcript string.
   * @returns {string}
   */
  const stopRecording = useCallback(() => {
    if (!sessionRef.current) return transcript;

    const finalText = sessionRef.current.stop();
    sessionRef.current = null;
    setIsRecording(false);
    setTranscript(finalText);
    return finalText;
  }, [transcript]);

  // ── cancelRecording ─────────────────────────────────────────────────────
  const cancelRecording = useCallback(() => {
    if (!sessionRef.current) return;

    sessionRef.current.cancel();
    sessionRef.current = null;
    setIsRecording(false);
    setTranscript('');
    setError(null);
  }, []);

  return {
    isSupported:     isSpeechRecognitionSupported(),
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
