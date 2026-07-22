import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h1 style={styles.title}>Settings</h1>

        <div className="card" style={styles.section}>
          <h3 style={styles.sectionTitle}>Profile</h3>
          <div style={styles.profileRow}>
            <div style={styles.avatar}>{student?.fullName?.[0]}</div>
            <div>
              <div style={styles.profileName}>{student?.fullName}</div>
              <div style={styles.profileMeta}>ID: {student?.studentId} · {student?.universityName} · Year {student?.yearOfStudy}</div>
            </div>
          </div>
        </div>

        <div className="card" style={styles.section}>
          <h3 style={styles.sectionTitle}>Preferences</h3>
          <div style={styles.prefRow}>
            <span style={styles.prefLabel}>Language</span>
            <select style={styles.select}>
              <option>English</option>
              <option>Urdu</option>
              <option>Sindhi</option>
            </select>
          </div>
          <div style={styles.prefRow}>
            <span style={styles.prefLabel}>Voice Mode Default</span>
            <select style={styles.select}>
              <option>Off</option>
              <option>On</option>
            </select>
          </div>
          <button className="btn-primary" style={{marginTop:8, alignSelf:'flex-start'}} onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        <div className="card" style={styles.section}>
          <h3 style={styles.sectionTitle}>Account</h3>
          <button className="btn-secondary" style={{alignSelf:'flex-start', borderColor:'var(--red)', color:'var(--red)'}} onClick={async () => { await logout(); navigate('/'); }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:        { minHeight:'100vh', background:'var(--bg-main)', padding:'32px 24px' },
  container:   { maxWidth:560, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 },
  back:        { border:'none', background:'transparent', color:'var(--text-mid)', fontSize:14, cursor:'pointer', fontWeight:600, fontFamily:'var(--font-head)', alignSelf:'flex-start', padding:0 },
  title:       { fontFamily:'var(--font-head)', fontSize:28, fontWeight:800, color:'var(--text-dark)' },
  section:     { padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 },
  sectionTitle: { fontFamily:'var(--font-head)', fontSize:16, fontWeight:800, color:'var(--text-dark)' },
  profileRow:  { display:'flex', alignItems:'center', gap:16 },
  avatar:      { width:52, height:52, background:'var(--purple-primary)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:22, fontFamily:'var(--font-head)', flexShrink:0 },
  profileName: { fontFamily:'var(--font-head)', fontWeight:700, fontSize:16, color:'var(--text-dark)' },
  profileMeta: { fontSize:13, color:'var(--text-light)', marginTop:4 },
  prefRow:     { display:'flex', justifyContent:'space-between', alignItems:'center' },
  prefLabel:   { fontSize:14, fontWeight:600, color:'var(--text-dark)', fontFamily:'var(--font-head)' },
  select:      { fontFamily:'var(--font-body)', fontSize:14, color:'var(--text-dark)', background:'var(--bg-main)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-md)', padding:'8px 14px', outline:'none', cursor:'pointer' },
};
