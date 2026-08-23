import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionAPI } from '../api/client';
import { useSession } from '../context/SessionContext';

const DEPARTMENTS = [
  { name:'General Medicine', icon:'🩺' },
  { name:'Gynecology',       icon:'👩' },
  { name:'Dentistry',        icon:'🦷' },
  { name:'Eye Specialist',   icon:'👁️' },
  { name:'Pediatrics',       icon:'👶' },
  { name:'ENT',              icon:'👂' },
  { name:'Psychiatry',       icon:'🧠' },
  { name:'Emergency',        icon:'🚨' },
  { name:'Cardiology',       icon:'❤️' },
  { name:'Orthopedics',      icon:'🦴' },
];

const CHARACTERS = [
  { name:'Saba Parveen',  type:'Anxious & Overthinking',      age:'Young Adult',      color:'#EC4899', svg: '/Casesetupcharacters/Saba.svg'      },
  { name:'Hamza Noor',    type:'Practical & Direct',           age:'Adult',            color:'#3B82F6', svg: '/Casesetupcharacters/Hamza.svg'     },
  { name:'Fatima Begum',  type:'Traditional & Resistive',      age:'Senior',           color:'#92400E', svg: '/Casesetupcharacters/Fatima.svg'    },
  { name:'Anas',          type:'Overconfident Self-Diagnoser', age:'Young Adult',      color:'#F59E0B', svg: '/Casesetupcharacters/Anas.svg'      },
  { name:'Erum',          type:'Quiet & Reserved',             age:'Teen/Young Adult', color:'#8B5CF6', svg: '/Casesetupcharacters/Erum.svg'      },
  { name:'Shahreyar',     type:'Curious & Nervous',            age:'Child (7–12)',     color:'#10B981', svg: '/Casesetupcharacters/Shahreyar.svg', bgSize: '60%' },
  { name:'Anum Shahzad',  type:'Cooperative & Curious',        age:'Adult',            color:'#6366F1', svg: '/Casesetupcharacters/Anum.svg'      },
];

export default function CaseSetupPage() {
  const [step, setStep]             = useState(1);
  const [department, setDepartment] = useState('');
  const [character, setCharacter]   = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const { startSession }            = useSession();
  const navigate                    = useNavigate();

  const handleStart = async () => {
    if (!department || !character) return;
    setLoading(true); setError('');
    try {
      const res = await sessionAPI.start(character, department);
      startSession(res.data);
      navigate('/consult');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start session.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container} className="page-enter">
        <button style={styles.back} onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)}>
          ← Back
        </button>

        <div style={styles.progress}>
          <StepDot num={1} label="Department" active={step === 1} done={step > 1} />
          <div style={styles.progressLine} />
          <StepDot num={2} label="Patient"    active={step === 2} done={false} />
        </div>

        {step === 1 && (
          <div className="page-enter">
            <h2 style={styles.stepTitle}>Choose a Department</h2>
            <p style={styles.stepSub}>Select the medical department for this consultation.</p>
            <div style={styles.deptGrid}>
              {DEPARTMENTS.map(d => (
                <button
                  key={d.name}
                  style={{ ...styles.deptCard, ...(department === d.name ? styles.deptCardActive : {}) }}
                  onClick={() => { setDepartment(d.name); setStep(2); }}
                >
                  <span style={styles.deptIcon}>{d.icon}</span>
                  <span style={styles.deptName}>{d.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="page-enter">
            <h2 style={styles.stepTitle}>Choose Your Patient</h2>
            <p style={styles.stepSub}>
              Department: <strong style={{ color: 'var(--purple-primary)' }}>{department}</strong>
            </p>
            {error && <div style={styles.errorBox}>{error}</div>}
            <div style={styles.charGrid}>
              {CHARACTERS.map(c => (
                <button
                  key={c.name}
                  style={{
                    ...styles.charCard,
                    ...(character === c.name ? { ...styles.charCardActive, borderColor: c.color } : {}),
                  }}
                  onClick={() => setCharacter(c.name)}
                >
                  <div style={{
                    ...styles.charAvatarWrap,
                    backgroundColor: c.color + '15',
                    backgroundImage: `url(${c.svg})`,
                    backgroundSize: c.bgSize || '75%',
                    backgroundPosition: c.bgPosition || 'center top',
                  }} />
                  <div style={styles.charName}>{c.name}</div>
                  <div style={styles.charType}>{c.type}</div>
                  <div style={{ ...styles.charAge, background: c.color + '18', color: c.color }}>
                    {c.age}
                  </div>
                </button>
              ))}
            </div>
            <div style={styles.startRow}>
              <button
                className="btn-primary"
                style={{ padding: '14px 48px', fontSize: 16 }}
                onClick={handleStart}
                disabled={!character || loading}
              >
                {loading ? <Spinner /> : 'Begin Consultation →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepDot({ num, label, active, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done || active ? 'var(--purple-primary)' : '#fff',
        border: '2px solid ' + (done || active ? 'var(--purple-primary)' : 'var(--border)'),
        color: done || active ? '#fff' : 'var(--text-light)',
        fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-head)',
      }}>
        {done ? '✓' : num}
      </div>
      <span style={{
        fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-head)',
        color: active ? 'var(--purple-primary)' : 'var(--text-light)',
      }}>
        {label}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 18, height: 18,
      border: '3px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}

const styles = {
  page:           { minHeight: '100vh', background: 'var(--bg-main)', padding: '32px 24px' },
  container:      { maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 },
  back:           { border: 'none', background: 'transparent', color: 'var(--text-mid)', fontSize: 14, cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-head)', alignSelf: 'flex-start', padding: 0 },
  progress:       { display: 'flex', alignItems: 'center', gap: 12 },
  progressLine:   { flex: 1, height: 2, background: 'var(--border)', borderRadius: 99, maxWidth: 100 },
  stepTitle:      { fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800, color: 'var(--text-dark)' },
  stepSub:        { color: 'var(--text-mid)', fontSize: 15, marginTop: 6, marginBottom: 16 },

  deptGrid:       { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 },
  deptCard:       { background: '#fff', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'var(--transition)' },
  deptCardActive: { borderColor: 'var(--purple-primary)', background: 'var(--purple-ultra)', boxShadow: 'var(--shadow-md)' },
  deptIcon:       { fontSize: 28 },
  deptName:       { fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--text-dark)', textAlign: 'center', lineHeight: 1.3 },

  charGrid:       { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 },
  charCard:       { background: '#fff', border: '2px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '0 0 12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'var(--transition)', overflow: 'hidden' },
  charCardActive: { boxShadow: 'var(--shadow-md)', transform: 'translateY(-2px)' },

  // Use background-image approach via inline style on the div instead of <img>
  // so we can use background-size: cover and background-position: center top
  charAvatarWrap: {
    width: '100%',
    height: 130,
    flexShrink: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center top',
  },
  // img is hidden — we use backgroundImage on the wrapper instead
  charAvatar: { display: 'none' },

  charName:       { fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13, color: 'var(--text-dark)', textAlign: 'center', paddingTop: 0 },
  charType:       { fontSize: 11, color: 'var(--text-light)', textAlign: 'center', lineHeight: 1.3, padding: '0 10px' },
  charAge:        { padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-head)' },

  startRow:       { display: 'flex', justifyContent: 'center' },
  errorBox:       { background: 'var(--red-pale)', border: '1px solid #FFCDD2', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--red)', fontSize: 14, marginBottom: 16, fontWeight: 500 },
};
