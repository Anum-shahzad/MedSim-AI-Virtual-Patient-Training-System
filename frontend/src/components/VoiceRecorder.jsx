/**
 * VoiceRecorder.jsx
 *
 *  UI component for recording voice input and transcribing it to text using the Web Speech API.
 */

import { useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';


const BAR_COUNT = 20;

// Bell-curve height profile: edges are short, centre bars are tall
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const pos   = i / (BAR_COUNT - 1);
  const curve = Math.sin(pos * Math.PI);
  return Math.round(8 + curve * 20); // 8–28 px
});

export default function VoiceRecorder({ onConfirm, onClose }) {
  const {
    isSupported,
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useSpeechRecognition();

  const transcriptRef = useRef(null);

  // Start recording immediately on mount
  useEffect(() => {
    if (isSupported) startRecording();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll transcript horizontally as text grows
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollLeft = transcriptRef.current.scrollWidth;
    }
  }, [transcript]);

  const handleConfirm = () => {
    const finalText = stopRecording();
    onConfirm(finalText || transcript || '');
  };

  const handleCancel = () => {
    cancelRecording();
    onClose();
  };

  return (
    <>
      <style>{CSS}</style>

      <div style={S.wrapper}>

        {/* Mic orb with pulsing ring while recording */}
        <div style={{
          ...S.micOrb,
          boxShadow: isRecording
            ? '0 0 0 4px rgba(123,92,250,0.18), 0 0 0 8px rgba(123,92,250,0.07)'
            : '0 0 0 3px rgba(123,92,250,0.10)',
        }}>
          {isRecording && <div style={S.orbRing} className="vr-orb-ring" />}
          <MicIcon active={isRecording} />
        </div>

        {/* Waveform bars */}
        <div style={S.waveZone}>
          {BAR_HEIGHTS.map((maxH, i) => (
            <div
              key={i}
              className={isRecording ? 'vr-bar' : 'vr-bar-idle'}
              style={{
                ...S.bar,
                '--bar-max':   `${maxH}px`,
                '--bar-delay': `${(i * 0.055).toFixed(3)}s`,
                height: isRecording ? undefined : `${Math.max(3, Math.round(maxH * 0.18))}px`,
              }}
            />
          ))}
        </div>

        {/* Live transcript */}
        <div style={S.transcriptWrap} ref={transcriptRef}>
          {error ? (
            <span style={S.errorText}>{error}</span>
          ) : transcript ? (
            <span style={S.liveText}>{transcript}</span>
          ) : (
            <span style={S.placeholderText}>
              {isSupported ? 'Listening\u2026' : 'Speech recognition unavailable'}
            </span>
          )}
        </div>

        {/* Cancel */}
        <button style={S.iconBtn} onClick={handleCancel} title="Discard" className="vr-icon-btn">
          <XIcon />
        </button>

        {/* Confirm */}
        <button
          style={{
            ...S.iconBtn,
            ...S.confirmBtn,
            opacity: transcript.trim() && isSupported ? 1 : 0.4,
            cursor:  transcript.trim() && isSupported ? 'pointer' : 'not-allowed',
          }}
          onClick={handleConfirm}
          disabled={!transcript.trim() || !isSupported}
          title="Insert into message"
          className="vr-icon-btn"
        >
          <CheckIcon />
        </button>

      </div>
    </>
  );
}

function MicIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={active ? '#fff' : 'rgba(255,255,255,0.7)'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8"  y1="22" x2="16" y2="22" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const CSS = `
  @keyframes vr-dance {
    0%, 100% { height: 3px;             opacity: 0.28; }
    50%       { height: var(--bar-max); opacity: 1;    }
  }
  .vr-bar {
    animation: vr-dance 0.85s ease-in-out infinite;
    animation-delay: var(--bar-delay);
  }
  .vr-bar-idle {
    opacity: 0.22;
    transition: height 0.3s ease;
  }
  @keyframes vr-ring {
    0%   { transform: scale(1);   opacity: 0.5; }
    70%  { transform: scale(1.75); opacity: 0; }
    100% { transform: scale(1.75); opacity: 0; }
  }
  .vr-orb-ring { animation: vr-ring 1.6s ease-out infinite; }
  .vr-icon-btn:hover { background: rgba(123,92,250,0.10) !important; transform: scale(1.08); }
  .vr-icon-btn:active { transform: scale(0.94); }
`;

const S = {
  wrapper: {
    flex:        1,
    display:    'flex',
    alignItems: 'center',
    gap:          8,
    minWidth:     0,
  },
  micOrb: {
    width:         34,
    height:        34,
    borderRadius: '50%',
    background:   'var(--purple-primary)',
    display:       'flex',
    alignItems:   'center',
    justifyContent:'center',
    flexShrink:    0,
    position:     'relative',
    transition:   'box-shadow 0.3s ease',
  },
  orbRing: {
    position:     'absolute',
    inset:         0,
    borderRadius: '50%',
    border:       '2px solid rgba(123,92,250,0.55)',
    pointerEvents:'none',
  },
  waveZone: {
    display:       'flex',
    alignItems:   'center',
    gap:            2,
    flexShrink:    0,
    height:         34,
  },
  bar: {
    width:         3,
    borderRadius:  99,
    background:   'linear-gradient(180deg, var(--purple-primary) 0%, var(--purple-light) 100%)',
    flexShrink:    0,
  },
  transcriptWrap: {
    flex:       1,
    minWidth:    0,
    overflow:   'hidden',
    whiteSpace: 'nowrap',
    display:    'flex',
    alignItems: 'center',
  },
  liveText: {
    fontSize:  14,
    color:    'var(--text-dark)',
    fontFamily:'var(--font-body)',
    lineHeight: 1.5,
  },
  placeholderText: {
    fontSize:  14,
    color:    'var(--text-light)',
    fontStyle:'italic',
    fontFamily:'var(--font-body)',
  },
  errorText: {
    fontSize:  13,
    color:    'var(--red)',
    fontFamily:'var(--font-body)',
  },
  iconBtn: {
    width:         34,
    height:        34,
    borderRadius: '50%',
    border:       'none',
    background:   'transparent',
    cursor:       'pointer',
    display:       'flex',
    alignItems:   'center',
    justifyContent:'center',
    flexShrink:    0,
    color:        'var(--text-mid)',
    transition:   'background 0.15s ease, transform 0.15s ease',
    outline:      'none',
  },
  confirmBtn: {
    background: 'var(--purple-ultra)',
    color:      'var(--purple-primary)',
  },
};
