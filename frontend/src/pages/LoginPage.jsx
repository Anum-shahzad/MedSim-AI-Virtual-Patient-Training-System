import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(studentId.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <MedSimLogo size={56} />
          <h1 style={styles.brand}>MedSim</h1>
          <p style={styles.tagline}>Train like a real doctor.<br/>Learn without limits.</p>
          <div style={styles.featureList}>
            {['AI-powered virtual patients','Voice & text consultation','Strict clinical evaluation'].map(f => (
              <div key={f} style={styles.feature}>
                <span style={styles.featureDot}>✦</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div style={styles.characterRow}>
            {['😰','🧑','👴','👧','🧓','👦','🙋'].map((e,i) => (
              <div key={i} style={{...styles.avatarBubble, animationDelay: `${i*0.1}s`}}>{e}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formCard} className="page-enter">
          <div style={styles.formHeader}>
            <MedSimLogo size={36} />
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSub}>Sign in to continue your training</p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Student ID</label>
              <input
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="e.g. 0874"
                maxLength={50}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                maxLength={128}
                required
              />
            </div>
            <button className="btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}} disabled={loading}>
              {loading ? <Spinner /> : 'Sign In'}
            </button>
          </form>

          <p style={styles.switchText}>
            New student?{' '}
            <Link to="/signup" style={styles.link}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function MedSimLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#7B5CFA"/>
      <path d="M12 20h4l3-7 4 14 3-10 2 3h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Spinner() {
  return <div style={{width:18,height:18,border:'3px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>;
}

const styles = {
  page:      { display:'flex', height:'100vh', overflow:'hidden' },
  left:      { flex:1, background:'linear-gradient(145deg,#7B5CFA 0%,#6C63FF 50%,#A78BFA 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:48 },
  leftContent: { color:'#fff', maxWidth:380 },
  brand:     { fontFamily:'var(--font-head)', fontSize:42, fontWeight:900, marginTop:12, letterSpacing:'-1px' },
  tagline:   { fontSize:20, opacity:0.9, marginTop:12, lineHeight:1.5, fontFamily:'var(--font-head)', fontWeight:600 },
  featureList: { marginTop:32, display:'flex', flexDirection:'column', gap:12 },
  feature:   { display:'flex', alignItems:'center', gap:10, fontSize:15, opacity:0.9 },
  featureDot: { color:'#FFD700', fontSize:16 },
  characterRow: { display:'flex', gap:10, marginTop:40, flexWrap:'wrap' },
  avatarBubble: { width:44, height:44, background:'rgba(255,255,255,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, backdropFilter:'blur(8px)' },
  right:     { width:460, display:'flex', alignItems:'center', justifyContent:'center', padding:40, background:'var(--bg-main)' },
  formCard:  { background:'#fff', borderRadius:'var(--radius-xl)', padding:'40px 36px', boxShadow:'var(--shadow-lg)', width:'100%' },
  formHeader: { textAlign:'center', marginBottom:28 },
  formTitle: { fontFamily:'var(--font-head)', fontSize:26, fontWeight:800, color:'var(--text-dark)', marginTop:12 },
  formSub:   { color:'var(--text-mid)', fontSize:14, marginTop:4 },
  errorBox:  { background:'var(--red-pale)', border:'1px solid #FFCDD2', borderRadius:'var(--radius-md)', padding:'10px 14px', color:'var(--red)', fontSize:14, marginBottom:16, fontWeight:500 },
  form:      { display:'flex', flexDirection:'column', gap:16 },
  field:     { display:'flex', flexDirection:'column', gap:6 },
  label:     { fontSize:13, fontWeight:600, color:'var(--text-mid)', fontFamily:'var(--font-head)' },
  switchText:{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--text-mid)' },
  link:      { color:'var(--purple-primary)', fontWeight:700, textDecoration:'none' },
};
