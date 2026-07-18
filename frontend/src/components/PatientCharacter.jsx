import { useEffect, useRef, useCallback } from 'react';

/**
 * PatientCharacter — Animated 2D SVG patient character component.
 *
 * Loads SVG inline and animates:
 *   - Eye blinking (random 2–5 second intervals)
 *   - Mouth talking animation (cycles through mouth shapes)
 *   - Expression switching
 *   - Hand gesture switching (resting ↔ active, only 2 hands visible at a time)
 *   - Subtle breathing (scale pulse)
 */

const CHARACTER_CONFIG = {
  'Hamza_Noor': {
    file: '/characters/Hamza.svg',
    expressions: {
      neutral:     { eyes: ['Eye_Left_Half_Lid','Eye_Right_Half_Lid'],               eyebrows: ['Eyebrow_Left_Neutral','Eyebrow_Right_Neutral'],                             nose: 'Nose',           mouth: 'Mouth_Closed' },
      confident:   { eyes: ['Confident_Eye_Left','Confident_Eye_Right'],             eyebrows: ['Confident_Eyebrow_left','Confident_Eyebrow_Right'],                         nose: 'Confident_Nose', mouth: 'Confident_Mouth' },
      informative: { eyes: ['Informativ_Eye_Left_Half_Lid','Informativ_Eye_Right_Half_Lid'], eyebrows: ['Informativ_Eyebrow_Left_Neutral','Informativ_Eyebrow_Right_Neutral'],nose: 'Informativ_Nose',mouth: 'Informativ_Mouth' },
      angry:       { eyes: ['Angry_Eye_Left_Half_Lid','Angry_Eye_Right_Half_Lid'],   eyebrows: ['Angry_Eyebrow_Left_Furrowed','Angry_Eyebrow_Right_Furrowed'],               nose: 'Angry_Nose',     mouth: 'Angry_mouth' },
    },
    defaultExpression: 'neutral',
    blinkLayers:  ['Angry_Eye_Left_Half_Lid_closed','Angry_Eye_Right_Half_Lid_closed'],
    allEyeLayers: ['Eye_Left_Half_Lid','Eye_Right_Half_Lid','Confident_Eye_Left','Confident_Eye_Right','Informativ_Eye_Left_Half_Lid','Informativ_Eye_Right_Half_Lid','Angry_Eye_Left_Half_Lid','Angry_Eye_Right_Half_Lid','Angry_Eye_Left_Half_Lid_closed','Angry_Eye_Right_Half_Lid_closed'],
    allEyebrowLayers: ['Eyebrow_Left_Neutral','Eyebrow_Right_Neutral','Eyebrows','Confident_Eyebrow_left','Confident_Eyebrow_Right','Informativ_Eyebrow_Left_Neutral','Informativ_Eyebrow_Right_Neutral','Angry_Eyebrow_Left_Furrowed','Angry_Eyebrow_Right_Furrowed'],
    allNoseLayers:  ['Nose','Confident_Nose','Informativ_Nose','Angry_Nose'],
    allMouthLayers: ['Mouth_Closed','Mouth_M','Mouth_Open_A','Mouth_Open_E','Mouth_Open_O','Mouth_Smile','Mouth_straight_closed','Confident_Mouth','Informativ_Mouth','Angry_mouth'],
    talkingMouths:  ['Mouth_Open_A','Mouth_Open_E','Mouth_Open_O','Mouth_M','Mouth_Closed','Mouth_Open_A'],
    // Hamza has no alternate hand layers — all hand layers always visible
    restingHands:  [],
    activeHands:   [],
    allHandLayers: [],
  },

  'Anas': {
    file: '/characters/Anas.svg',
    expressions: {
      natural:     { eyes: ['Natural_Eye_Right','Natural_Eye_Left','Natural_Eye_Right_Iris','Natural_Eye_Left_Iris'],       eyebrows: ['Natural_Eyebrow_Right','Natural_Eyebrow_Left'],         nose: 'Natural_Nose',     mouth: 'Natural_Mouth' },
      confident:   { eyes: ['Confident_Eye_Right','Confident_Eye_Left','Confident_Eye_Right_Iris','Confident_Eye_Left_Iris'], eyebrows: ['Confident_Eyebrow_Right','Confident_Eyebrow_Left'],   nose: 'Confident_Nose',   mouth: 'Confident_Mouth' },
      unimpressed: { eyes: ['Unimpressed_Eye_Right','Unimpressed_Eye_Left','Unimpressed_Eye_Right_Iris','Unimpressed_Eye_Left_Iris'], eyebrows: ['Unimpressed_Eyebrow_Right','Unimpressed_Eyebrow_Left'], nose: 'Unimpressed_Nose', mouth: 'Unimpressed_Mouth' },
    },
    defaultExpression: 'natural',
    blinkLayers:  ['Eye_Right_Half_Lid_closed','Eye_Left_Half_Lid_closed'],
    allEyeLayers: ['Natural_Eye_Right','Natural_Eye_Left','Natural_Eye_Right_Iris','Natural_Eye_Left_Iris','Confident_Eye_Right','Confident_Eye_Left','Confident_Eye_Right_Iris','Confident_Eye_Left_Iris','Unimpressed_Eye_Right','Unimpressed_Eye_Left','Unimpressed_Eye_Right_Iris','Unimpressed_Eye_Left_Iris','Eye_Right_Half_Lid_closed','Eye_Left_Half_Lid_closed'],
    allEyebrowLayers: ['Natural_Eyebrow_Right','Natural_Eyebrow_Left','Confident_Eyebrow_Right','Confident_Eyebrow_Left','Unimpressed_Eyebrow_Right','Unimpressed_Eyebrow_Left'],
    allNoseLayers:  ['Natural_Nose','Confident_Nose','Unimpressed_Nose'],
    allMouthLayers: ['Natural_Mouth','Confident_Mouth','Unimpressed_Mouth','Mouth_Smile','Mouth_M','Mouth_Open_O','Mouth_Open_E','Mouth_Open_A','Mouth_straight_closed','Whistle_Mouth'],
    talkingMouths:  ['Mouth_Open_A','Mouth_Open_E','Mouth_Open_O','Mouth_M','Mouth_straight_closed','Mouth_Open_A'],
    // Anas: new SVG has only one set of arms (no separate resting layers).
    // Arms are always visible — no hand switching needed.
    restingHands:  ['Arm_Left_Lower','Arm_Left_Upper','Arm_Right_Lower','Arm_Right_Upper'],
    activeHands:   ['Arm_Left_Lower','Arm_Left_Upper','Arm_Right_Lower','Arm_Right_Upper'],
    allHandLayers: ['Arm_Left_Lower','Arm_Left_Upper','Arm_Right_Lower','Arm_Right_Upper'],
  },

  'Anum_Shahzad': {
    file: '/characters/Anum.svg',
    expressions: {
      neutral: { eyes: ['Eye_Right_White','Eye_Right_Iris','Eye_Right_Pupil','Eye_Left_White','Eye_Left_Iris','Eye_Left_Pupil'], eyebrows: ['Eyebrow_Right','Eyebrow_Left'], nose: 'Nose', mouth: 'Mouth_Smile' },
      sad:     { eyes: ['Eye_Right_White','Eye_Right_Iris','Eye_Right_Pupil','Eye_Left_White','Eye_Left_Iris','Eye_Left_Pupil'], eyebrows: ['Eyebrow_Right','Eyebrow_Left'], nose: 'Nose', mouth: 'Mouth_Sad_closed' },
    },
    defaultExpression: 'neutral',
    blinkLayers:  ['Right_Eye_Closed','Left_Eye_Closed'],
    allEyeLayers: ['Eye_Right_White','Eye_Right_Iris','Eye_Right_Pupil','Eye_Left_White','Eye_Left_Iris','Eye_Left_Pupil','Right_Eye_Closed','Left_Eye_Closed'],
    allEyebrowLayers: ['Eyebrow_Right','Eyebrow_Left'],
    allNoseLayers:  ['Nose'],
    allMouthLayers: ['Mouth_Smile','Mouth_Open_A','Mouth_Open_E','Mouth_Open_O','Mouth_M','Mouth_Sad_closed'],
    talkingMouths:  ['Mouth_Open_A','Mouth_Open_E','Mouth_Open_O','Mouth_M','Mouth_Smile','Mouth_Open_A'],
    restingHands:  ['Hand_Right','Hand_Left','Arm_Right_Lower','Arm_Right_Upper','Arm_Left_Lower','Arm_Left_Upper'],
    activeHands:   ['Hand_Right','Hand_Left','Arm_Right_Lower','Arm_Right_Upper','Arm_Left_Lower','Arm_Left_Upper'],
    allHandLayers: ['Hand_Right','Hand_Left','Arm_Right_Lower','Arm_Right_Upper','Arm_Left_Lower','Arm_Left_Upper'],
  },

  'Saba_Parveen': {
    file: '/characters/Saba.svg',
    expressions: {
      scared:   { eyes: ['Scared_Eye_Right_White','Scared_Eye_Left_White','Scared_Eye_Right_Eyelid_Lower','Scared_Eye_Left_Eyelid_Lower','Scared_Eye_Right_Pupil','Scared_Eye_Left_Pupil'], eyebrows: ['Scared_Eyebrow_Right','Scared_Eyebrow_Left'],   nose: 'Scared_Nose',   mouth: 'Scared_Mouth' },
      confused: { eyes: ['Confused_Eye_Right_White','Confused_Eye_Left_White','Confused_Eye_Right_Eyelid_Lower','Confused_Eye_Left_Eyelid_Lower','Confused_Eye_Right_Pupil','Confused_Eye_Left_Pupil'], eyebrows: ['Confused_Eyebrow_Right','Confused_Eyebrow_Left'], nose: 'Confused_Nose', mouth: 'Confused_Mouth' },
      happy:    { eyes: ['Happy_Eye_Right_White','Happy_Eye_Left_White','Happy_Eye_Right_Pupil','Happy_Eye_Left_Pupil'],                                                                   eyebrows: ['Happy_Eyebrow_Right','Happy_Eyebrow_Left'],     nose: 'Happy_Nose',    mouth: 'Happy_Mouth' },
    },
    defaultExpression: 'scared',
    blinkLayers:      ['Eyes_Right_Closed','Eyes_Left_Closed'],
    happyBlinkLayers: ['Happy_Eye_Right_Closed','Happy_Eye_Left_Closed'],
    allEyeLayers: ['Scared_Eye_Right_White','Scared_Eye_Left_White','Scared_Eye_Right_Eyelid_Lower','Scared_Eye_Left_Eyelid_Lower','Scared_Eye_Right_Pupil','Scared_Eye_Left_Pupil','Confused_Eye_Right_White','Confused_Eye_Left_White','Confused_Eye_Right_Eyelid_Lower','Confused_Eye_Left_Eyelid_Lower','Confused_Eye_Right_Pupil','Confused_Eye_Left_Pupil','Happy_Eye_Right_White','Happy_Eye_Left_White','Happy_Eye_Right_Pupil','Happy_Eye_Left_Pupil','Happy_Eye_Right_Closed','Happy_Eye_Left_Closed','Eyes_Right_Closed','Eyes_Left_Closed'],
    allEyebrowLayers: ['Scared_Eyebrow_Right','Scared_Eyebrow_Left','Confused_Eyebrow_Right','Confused_Eyebrow_Left','Happy_Eyebrow_Right','Happy_Eyebrow_Left'],
    allNoseLayers:  ['Scared_Nose','Confused_Nose','Happy_Nose'],
    allMouthLayers: ['Scared_Mouth','Confused_Mouth','Mouth_smile_closed','Mouth_M','Mouth_Open_O','Mouth_Open_E','Mouth_Open_A','Mouth_straight_closed','Mouth_Closed','Sad_Mouth_Closed','Happy_Mouth'],
    talkingMouths:  ['Mouth_Open_A','Mouth_Open_E','Mouth_Open_O','Mouth_M','Mouth_Closed','Mouth_Open_A'],
    // Saba: new SVG has only one set of arms (no separate Rest_Left_arm_Lower layer).
    // Arms are always visible — no hand switching needed.
    restingHands:  ['Hand_Right','Hand_Left','Arm_Right_Lower','Arm_Right_Upper','Arm_Left_Upper','Arm_Left_Lower'],
    activeHands:   ['Hand_Right','Hand_Left','Arm_Right_Lower','Arm_Right_Upper','Arm_Left_Upper','Arm_Left_Lower'],
    allHandLayers: ['Hand_Right','Hand_Left','Arm_Right_Lower','Arm_Right_Upper','Arm_Left_Upper','Arm_Left_Lower'],
  },
};

const CHAR_KEY_MAP = {
  'Hamza Noor':   'Hamza_Noor',
  'Anas':         'Anas',
  'Saba Parveen': 'Saba_Parveen',
  'Anum Shahzad': 'Anum_Shahzad',
};

export default function PatientCharacter({ characterName, isTalking = false, expression = null }) {
  const containerRef   = useRef(null);
  const svgDocRef      = useRef(null);
  const blinkTimerRef  = useRef(null);
  const talkTimerRef   = useRef(null);
  const talkIndexRef   = useRef(0);
  const currentExprRef = useRef(null);
  const isHappyRef     = useRef(false);

  const charKey = CHAR_KEY_MAP[characterName];
  const config  = charKey ? CHARACTER_CONFIG[charKey] : null;

  // ── Layer helpers ─────────────────────────────────────────────────────
  const getLayer = useCallback((id) => svgDocRef.current?.getElementById(id), []);

  const show = useCallback((id) => {
    const el = getLayer(id);
    if (el) el.style.display = '';
  }, [getLayer]);

  const hide = useCallback((id) => {
    const el = getLayer(id);
    if (el) el.style.display = 'none';
  }, [getLayer]);

  const hideAll = useCallback((ids) => ids.forEach(id => hide(id)), [hide]);
  const showAll = useCallback((ids) => ids.forEach(id => show(id)), [show]);

  // ── Hand gesture: show resting or active hands ────────────────────────
  const showRestingHands = useCallback(() => {
    if (!config || config.allHandLayers.length === 0) return;
    hideAll(config.allHandLayers);
    showAll(config.restingHands);
  }, [config, hideAll, showAll]);

  const showActiveHands = useCallback(() => {
    if (!config || config.allHandLayers.length === 0) return;
    hideAll(config.allHandLayers);
    showAll(config.activeHands);
  }, [config, hideAll, showAll]);

  // ── Apply expression ──────────────────────────────────────────────────
  const applyExpression = useCallback((exprName) => {
    if (!config) return;
    const expr = config.expressions[exprName];
    if (!expr) return;

    currentExprRef.current = exprName;
    isHappyRef.current = (exprName === 'happy');

    hideAll(config.allEyeLayers);
    hideAll(config.allEyebrowLayers);
    hideAll(config.allNoseLayers);
    hideAll(config.allMouthLayers);

    expr.eyes.forEach(id => show(id));
    expr.eyebrows.forEach(id => show(id));
    show(expr.nose);
    show(expr.mouth);
  }, [config, show, hideAll]);

  // ── Blink ─────────────────────────────────────────────────────────────
  const triggerBlink = useCallback(() => {
    if (!config || !svgDocRef.current) return;
    const blinkIds = (isHappyRef.current && config.happyBlinkLayers)
      ? config.happyBlinkLayers
      : config.blinkLayers;

    hideAll(config.allEyeLayers);
    blinkIds.forEach(id => show(id));

    setTimeout(() => {
      hideAll(config.allEyeLayers);
      const expr = config.expressions[currentExprRef.current || config.defaultExpression];
      if (expr) expr.eyes.forEach(id => show(id));
    }, 120);
  }, [config, show, hideAll]);

  const scheduleBlink = useCallback(() => {
    const delay = 2000 + Math.random() * 3000;
    blinkTimerRef.current = setTimeout(() => {
      triggerBlink();
      scheduleBlink();
    }, delay);
  }, [triggerBlink]);

  // ── Talking ───────────────────────────────────────────────────────────
  const startTalking = useCallback(() => {
    if (!config) return;
    talkIndexRef.current = 0;
    showActiveHands();

    const cycle = () => {
      const mouths = config.talkingMouths;
      hideAll(config.allMouthLayers);
      show(mouths[talkIndexRef.current % mouths.length]);
      talkIndexRef.current++;
      talkTimerRef.current = setTimeout(cycle, 120);
    };
    cycle();
  }, [config, show, hideAll, showActiveHands]);

  const stopTalking = useCallback(() => {
    clearTimeout(talkTimerRef.current);
    if (!config) return;
    hideAll(config.allMouthLayers);
    const expr = config.expressions[currentExprRef.current || config.defaultExpression];
    if (expr) show(expr.mouth);
    showRestingHands();
  }, [config, show, hideAll, showRestingHands]);

  // ── Load SVG inline ───────────────────────────────────────────────────
  useEffect(() => {
    if (!config || !containerRef.current) return;

    fetch(config.file)
      .then(r => r.text())
      .then(svgText => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = svgText;
        const svgEl = containerRef.current.querySelector('svg');
        if (!svgEl) return;

        svgEl.style.width  = '100%';
        svgEl.style.height = '100%';
        svgEl.removeAttribute('width');
        svgEl.removeAttribute('height');
        svgDocRef.current = svgEl;

        setTimeout(() => {
          applyExpression(config.defaultExpression);
          showRestingHands();
          scheduleBlink();
        }, 50);
      })
      .catch(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:60px;">${getFallbackEmoji(characterName)}</div>`;
        }
      });

    return () => {
      clearTimeout(blinkTimerRef.current);
      clearTimeout(talkTimerRef.current);
    };
  }, [config, characterName]);

  // ── React to isTalking prop ───────────────────────────────────────────
  useEffect(() => {
    if (!svgDocRef.current) return;
    if (isTalking) startTalking();
    else           stopTalking();
  }, [isTalking]);

  // ── React to expression prop ──────────────────────────────────────────
  useEffect(() => {
    if (!svgDocRef.current || !expression) return;
    applyExpression(expression);
  }, [expression]);

  if (!config) {
    return (
      <div style={styles.fallback}>
        <span style={{fontSize:72}}>{getFallbackEmoji(characterName)}</span>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scaleY(1) translateY(0px); }
          50%       { transform: scaleY(1.012) translateY(-3px); }
        }
      `}</style>
      <div
        ref={containerRef}
        style={styles.container}
        className="character-breathing"
      />
    </div>
  );
}

function getFallbackEmoji(name) {
  return {'Saba Parveen':'😰','Hamza Noor':'😐','Anas':'😏','Anum Shahzad':'🙂'}[name] || '🧑';
}

const styles = {
  wrapper:   { width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' },
  container: { width:'100%', height:'100%', transformOrigin:'bottom center', animation:'breathe 4s ease-in-out infinite' },
  fallback:  { width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--purple-ultra)', borderRadius:'var(--radius-lg)' },
};
