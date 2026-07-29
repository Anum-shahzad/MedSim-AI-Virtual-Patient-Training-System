/**
 * voiceService.js — Browser-based Text-to-Speech for MedSim
 *
 * Replaces ElevenLabs TTS with the built-in Web Speech API (SpeechSynthesis).
 * This works natively in Electron (Chromium) with zero external dependencies.
 *
 * Architecture:
 *  - speakPatientReply(reply, patientData) is the single public entry point.
 *  - Voice selection is dynamic — no hardcoded indexes.
 *  - Speech parameters (pitch, rate) are derived from ageGroup + personality/emotionalState.
 *  - Handles the Electron/Chromium async voice-loading quirk via voiceschanged event.
 *
 * Usage:
 *   import { speakPatientReply } from '../services/voiceService';
 *   speakPatientReply(res.data.patientReply, { ageGroup: session.ageGroup, personality: session.personality });
 */

// ── Internal state ──────────────────────────────────────────────────────────


/** Cached voice list — populated once voices load asynchronously. */
let _cachedVoices = [];

/** Whether the voice cache has been populated at least once. */
let _voicesReady = false;

// ── Voice Loading ───────────────────────────────────────────────────────────

/**
 * Initialises the voice cache.
 * In Electron/Chromium, getVoices() returns [] synchronously on first call.
 * We listen for 'voiceschanged' to know when they are truly available.
 *
 * Call this once on app startup (or lazily — speakPatientReply calls it too).
 */
export function initVoices() {
  if (!('speechSynthesis' in window)) {
    console.warn('[voiceService] Web Speech API not supported in this environment.');
    return;
  }

  const populate = () => {
    _cachedVoices = window.speechSynthesis.getVoices();
    _voicesReady  = _cachedVoices.length > 0;
    if (_voicesReady) {
      console.log(`[voiceService] ${_cachedVoices.length} voices loaded.`);
    }
  };

  // Try immediately — works in some environments
  populate();

  // Also listen for the async event (Electron fires this after startup)
  window.speechSynthesis.onvoiceschanged = populate;
}

/**
 * Returns the current voice list — initialises if not already done.
 * @returns {SpeechSynthesisVoice[]}
 */
function getVoices() {
  if (!_voicesReady) initVoices();
  // In case voiceschanged hasn't fired yet, try again directly
  if (_cachedVoices.length === 0) {
    _cachedVoices = window.speechSynthesis.getVoices();
  }
  return _cachedVoices;
}

// ── Voice Selection ─────────────────────────────────────────────────────────

/**
 * Selects the best available voice for a given gender preference.
 * Strategy:
 *  1. Prefer voices whose name includes gender keywords (e.g. "Female", "Male").
 *  2. Fallback to any English voice.
 *  3. Ultimate fallback: first available voice (browser default).
 *
 * @param {'female'|'male'} gender
 * @returns {SpeechSynthesisVoice|null}
 */
function selectVoice(gender) {
  const voices = getVoices();
  if (voices.length === 0) return null;

  const genderKeywords = gender === 'female'
    ? ['female', 'woman', 'girl', 'zira', 'hazel', 'susan', 'karen', 'samantha', 'victoria', 'fiona', 'moira', 'tessa']
    : ['male', 'man', 'guy', 'david', 'mark', 'george', 'daniel', 'alex', 'tom', 'fred'];

  // 1. Try to match by gender keyword in voice name
  const genderMatch = voices.find(v =>
    genderKeywords.some(kw => v.name.toLowerCase().includes(kw))
  );
  if (genderMatch) return genderMatch;

  // 2. Any English voice as fallback
  const englishVoice = voices.find(v =>
    v.lang && (v.lang.startsWith('en-') || v.lang === 'en')
  );
  if (englishVoice) return englishVoice;

  // 3. Absolute fallback — first voice in list
  return voices[0];
}

// ── Speech Parameter Calculation ────────────────────────────────────────────

/**
 * Derives pitch and rate from the patient's age group.
 * Values stay within SpeechSynthesisUtterance safe ranges:
 *   pitch: 0.0 – 2.0 (default 1.0)
 *   rate:  0.1 – 10  (default 1.0)
 *
 * @param {string} ageGroup  — e.g. 'Child', 'Teen', 'YoungAdult', 'Adult', 'Senior'
 * @returns {{ pitch: number, rate: number }}
 */
function paramsFromAgeGroup(ageGroup) {
  const ag = (ageGroup || '').toLowerCase();

  if (ag.includes('child'))  return { pitch: 1.6, rate: 1.15 }; // Higher pitch, slightly faster
  if (ag.includes('teen'))   return { pitch: 1.3, rate: 1.1  }; // Slightly higher, normal-ish
  if (ag.includes('senior')) return { pitch: 0.8, rate: 0.85 }; // Lower pitch, slower
  // YoungAdult / Adult / default
  return { pitch: 1.0, rate: 1.0 };
}

/**
 * Applies personality / emotional-state modifiers on top of age-group params.
 * Modifiers are additive offsets — clamped to safe ranges afterward.
 *
 * @param {{ pitch: number, rate: number }} base
 * @param {string} personality  — e.g. 'Anxious & Overthinking', 'Calm', 'Angry'
 * @param {string} emotionalState — e.g. 'Anxious', 'Calm', 'Sad', 'Angry'
 * @returns {{ pitch: number, rate: number }}
 */
function applyPersonalityModifiers(base, personality, emotionalState) {
  // Combine both fields for matching (some sessions only carry one)
  const combined = `${personality || ''} ${emotionalState || ''}`.toLowerCase();

  let { pitch, rate } = base;

  if (combined.includes('anxious') || combined.includes('nervous') || combined.includes('overthink')) {
    // Nervous/anxious → faster, slightly higher pitch (shaky feeling)
    rate  += 0.18;
    pitch += 0.15;
  } else if (combined.includes('angry') || combined.includes('agitated') || combined.includes('irritat')) {
    // Angry → slightly faster, slightly stronger (no pitch drop — keep forceful)
    rate  += 0.12;
    pitch += 0.05;
  } else if (combined.includes('weak') || combined.includes('sick') || combined.includes('tired') || combined.includes('fatigue')) {
    // Weak/sick → slower, quieter feel
    rate  -= 0.18;
    pitch -= 0.1;
  } else if (combined.includes('sad') || combined.includes('depress') || combined.includes('low')) {
    // Sad/depressed → slower, slightly lower pitch
    rate  -= 0.12;
    pitch -= 0.08;
  } else if (combined.includes('calm') || combined.includes('relaxed') || combined.includes('stable')) {
    // Calm → keep balanced, slight smoothing
    rate  = Math.max(rate - 0.05, 0.85);
  }
  // 'Neutral' and unknown states: no modification

  // Clamp to safe Web Speech API ranges
  pitch = Math.min(2.0, Math.max(0.5, pitch));
  rate  = Math.min(1.8, Math.max(0.5, rate));

  return { pitch, rate };
}

// ── Gender Inference ────────────────────────────────────────────────────────

/**
 * Infers preferred voice gender from the patient character name.
 * MedSim character names: Saba, Hamza, Anas, Fatima, Erum, Shahreyar, Anum.
 *
 * @param {string} characterName
 * @returns {'female'|'male'}
 */
function inferGender(characterName) {
  const name = (characterName || '').toLowerCase();
  const femaleNames = ['saba', 'fatima', 'erum', 'anum', 'ayesha', 'sara', 'maria'];
  if (femaleNames.some(fn => name.includes(fn))) return 'female';
  return 'male'; // default
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Speaks a patient reply using browser-native speech synthesis.
 *
 * Automatically stops any currently playing speech before starting new speech
 * to prevent overlap between rapid exchanges.
 *
 * @param {string} reply        — The patient's text reply from the backend.
 * @param {object} patientData  — Context object with patient metadata.
 * @param {string} [patientData.ageGroup]      — e.g. 'Child', 'Adult', 'Senior'
 * @param {string} [patientData.personality]   — e.g. 'Anxious & Overthinking'
 * @param {string} [patientData.emotionalState] — e.g. 'Anxious', 'Calm'
 * @param {string} [patientData.characterName] — e.g. 'Saba Parveen'
 * @param {function} [onEnd]    — Optional callback fired when speech finishes.
 * @returns {SpeechSynthesisUtterance|null}    — The utterance, or null if unsupported.
 */
export function speakPatientReply(reply, patientData = {}, onEnd = null) {
  // Guard: Web Speech API availability
  if (!('speechSynthesis' in window)) {
    console.warn('[voiceService] speechSynthesis not available — skipping TTS.');
    return null;
  }

  // Guard: empty reply
  if (!reply || typeof reply !== 'string' || !reply.trim()) {
    console.warn('[voiceService] speakPatientReply called with empty reply.');
    return null;
  }

  // ── Stop any speech currently playing ──────────────────────────────────
  window.speechSynthesis.cancel();

  // ── Build utterance ─────────────────────────────────────────────────────
  const utterance = new SpeechSynthesisUtterance(reply.trim());

  // ── Compute speech parameters ───────────────────────────────────────────
  const { ageGroup, personality, emotionalState, characterName } = patientData;

  const baseParams = paramsFromAgeGroup(ageGroup);
  const finalParams = applyPersonalityModifiers(baseParams, personality, emotionalState);

  utterance.pitch  = finalParams.pitch;
  utterance.rate   = finalParams.rate;
  utterance.volume = 1.0; // Full volume — user controls OS-level volume

  // ── Voice selection ─────────────────────────────────────────────────────
  const gender = inferGender(characterName);
  const chosenVoice = selectVoice(gender);
  if (chosenVoice) {
    utterance.voice = chosenVoice;
    utterance.lang  = chosenVoice.lang || 'en-US';
  } else {
    utterance.lang = 'en-US'; // Fallback language hint
  }

  // ── Event handlers ──────────────────────────────────────────────────────
  utterance.onstart = () => {
    console.log(
      `[voiceService] Speaking — ageGroup:${ageGroup} personality:${personality} ` +
      `pitch:${finalParams.pitch.toFixed(2)} rate:${finalParams.rate.toFixed(2)} ` +
      `voice:${chosenVoice?.name || 'default'}`
    );
  };

  utterance.onend = () => {
    if (typeof onEnd === 'function') onEnd();
  };

  utterance.onerror = (e) => {
    // 'interrupted' is not a real error — it means cancel() was called
    if (e.error !== 'interrupted') {
      console.error('[voiceService] Speech error:', e.error);
    }
  };

  // ── Speak ───────────────────────────────────────────────────────────────
  window.speechSynthesis.speak(utterance);

  return utterance;
}

/**
 * Immediately stops any ongoing speech synthesis.
 * Call this when navigating away or ending a session.
 */
export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
