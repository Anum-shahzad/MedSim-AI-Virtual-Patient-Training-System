import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const YEARS = [1,2,3,4,5,6];

export default function SignupPage() {
  const [form, setForm] = useState({ studentId:'', fullName:'', universityName:'', yearOfStudy:1, languagePref:'English', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { signup }  = useAuth();
  const navigate    = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="page-enter">
        <div style={styles.header}>
          <MedSimLogo />
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.sub}>Join MedSim and start training</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <Field label="Student ID" value={form.studentId} onChange={v=>set('studentId',v)} placeholder="e.g. 0874" maxLength={50} required />
            <Field label="Full Name" value={form.fullName} onChange={v=>set('fullName',v)} placeholder="Your full name" required />
          </div>
          <Field label="University Name" value={form.universityName} onChange={v=>set('universityName',v)} placeholder="Your university" required />
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Year of Study</label>
              <select style={styles.select} value={form.yearOfStudy} onChange={e=>set('yearOfStudy', parseInt(e.target.value))}>
                {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Language</label>
              <select style={styles.select} value={form.languagePref} onChange={e=>set('languagePref',e.target.value)}>
                {['English','Urdu','Sindhi'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <Field label="Password" type="password" value={form.password} onChange={v=>set('password',v)} placeholder="Min 6 characters" required />

          <button className="btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}} disabled={loading}>
            {loading ? <Spinner /> : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already registered?{' '}
          <Link to="/" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type='text', placeholder, maxLength, required }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,flex:1}}>
      <label style={{fontSize:13,fontWeight:600,color:'var(--text-mid)',fontFamily:'var(--font-head)'}}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} required={required} />
    </div>
  );
}

function MedSimLogo() {
  return <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="12" fill="#7B5CFA"/><path d="M12 20h4l3-7 4 14 3-10 2 3h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function Spinner() {
  return <div style={{width:18,height:18,border:'3px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>;
}

const styles = {
  page:   { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(145deg,#7B5CFA 0%,#A78BFA 100%)', padding:24 },
  card:   { background:'#fff', borderRadius:'var(--radius-xl)', padding:'40px 40px', boxShadow:'var(--shadow-lg)', width:'100%', maxWidth:580 },
  header: { textAlign:'center', marginBottom:28 },
  title:  { fontFamily:'var(--font-head)', fontSize:26, fontWeight:800, color:'var(--text-dark)', marginTop:12 },
  sub:    { color:'var(--text-mid)', fontSize:14, marginTop:4 },
  errorBox: { background:'var(--red-pale)', border:'1px solid #FFCDD2', borderRadius:'var(--radius-md)', padding:'10px 14px', color:'var(--red)', fontSize:14, marginBottom:16, fontWeight:500 },
  form:   { display:'flex', flexDirection:'column', gap:14 },
  row:    { display:'flex', gap:14 },
  field:  { display:'flex', flexDirection:'column', gap:6, flex:1 },
  label:  { fontSize:13, fontWeight:600, color:'var(--text-mid)', fontFamily:'var(--font-head)' },
  select: { fontFamily:'var(--font-body)', fontSize:15, color:'var(--text-dark)', background:'var(--bg-white)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-md)', padding:'12px 16px', outline:'none', cursor:'pointer' },
  switchText: { textAlign:'center', marginTop:20, fontSize:14, color:'var(--text-mid)' },
  link:   { color:'var(--purple-primary)', fontWeight:700, textDecoration:'none' },
};
