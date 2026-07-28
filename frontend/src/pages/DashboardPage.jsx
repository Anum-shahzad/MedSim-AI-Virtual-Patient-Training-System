import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { historyAPI } from '../api/client';

const NAV_ITEMS = [
  { icon:'🏠', label:'Dashboard', path:'/dashboard' },
  { icon:'📋', label:'History',   path:'/history' },
  { icon:'🏆', label:'Leaderboard', path:'/leaderboard' },
  { icon:'⚙️', label:'Settings',  path:'/settings' },
];

export default function DashboardPage() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [active, setActive]   = useState('/dashboard');

  useEffect(() => {
    historyAPI.list().then(r => setHistory(r.data)).catch(() => {});
  }, []);

  const casesCompleted = history.length;
  const avgScore = history.length
    ? (history.reduce((s,h) => s + (h.totalScore||0), 0) / history.length).toFixed(1)
    : '—';
  const passRate = history.filter(h => (h.totalScore||0) >= 70).length;

  
  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sideTop}>
          <div style={styles.logo}>
            <MedSimLogo />
            <span style={styles.logoText}>MedSim</span>
          </div>
          <nav style={styles.nav}>
            {NAV_ITEMS.map(item => (
              <button key={item.path} style={{...styles.navBtn, ...(active===item.path ? styles.navBtnActive : {})}}
                onClick={() => { setActive(item.path); navigate(item.path); }}>
                <span style={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div style={styles.sideBottom}>
          <div style={styles.studentChip}>
            <div style={styles.avatar}>{student?.fullName?.[0] || 'S'}</div>
            <div>
              <div style={styles.studentName}>{student?.fullName}</div>
              <div style={styles.studentId}>ID: {student?.studentId}</div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={logout}>↩ Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main} className="page-enter">
        {/* Header */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.welcome}>Good day, {student?.fullName?.split(' ')[0]} 👋</h1>
            <p style={styles.welcomeSub}>Ready for your next patient?</p>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <StatCard emoji="📁" label="Cases Completed" value={casesCompleted} color="#7B5CFA" />
          <StatCard emoji="⭐" label="Average Score" value={avgScore} color="#6C63FF" />
          <StatCard emoji="✅" label="Cases Passed" value={passRate} color="#4CAF50" />
          <StatCard emoji="🎓" label="Year of Study" value={`Year ${student?.yearOfStudy}`} color="#F57C00" />
        </div>

        {/* CTA */}
        <div style={styles.ctaCard}>
          <div style={styles.ctaLeft}>
            <div style={styles.ctaBadge}>New Session</div>
            <h2 style={styles.ctaTitle}>Examine a Patient</h2>
            <p style={styles.ctaDesc}>Choose a department and patient character to begin a new clinical consultation session.</p>
            <button className="btn-primary" style={styles.ctaBtn} onClick={() => navigate('/setup')}>
              Start Consultation →
            </button>
          </div>
          <div style={styles.ctaRight}>
            <div style={styles.ctaCharacters}>
              {['😰','🧑','👴','👧','🧓','👦','🙋'].map((e,i) => (
                <div key={i} style={{...styles.ctaAvatar, transform:`rotate(${(i-3)*8}deg) translateY(${Math.abs(i-3)*4}px)`}}>{e}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Recent Cases</h3>
            <button style={styles.seeAll} onClick={() => navigate('/history')}>See all →</button>
          </div>
          {history.length === 0
            ? <div style={styles.emptyState}>
                <span style={{fontSize:40}}>🩺</span>
                <p>No cases yet. Start your first consultation above!</p>
              </div>
            : <div style={styles.historyList}>
                {history.slice(0,4).map(h => <HistoryRow key={h.caseId} item={h} />)}
              </div>
          }
        </div>
      </main>
    </div>
  );
}

function StatCard({ emoji, label, value, color }) {
  return (
    <div className="card" style={styles.statCard}>
      <div style={{...styles.statIcon, background: color+'18', color}}>{emoji}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function HistoryRow({ item }) {
  const grade = item.grade || '—';
  const score = item.totalScore ? `${item.totalScore.toFixed(1)}%` : '—';
  const gradeColor = { A:'#4CAF50', B:'#8BC34A', C:'#F57C00', D:'#FF7043', F:'#EF5350' }[grade] || '#9E9E9E';
  return (
    <div style={styles.historyRow}>
      <div style={styles.historyLeft}>
        <div style={styles.historyDot} />
        <div>
          <div style={styles.historyPatient}>{item.patientCharacter}</div>
          <div style={styles.historyDept}>{item.department}</div>
        </div>
      </div>
      <div style={styles.historyRight}>
        <span style={{...styles.gradeChip, background: gradeColor+'18', color: gradeColor}}>{grade}</span>
        <span style={styles.historyScore}>{score}</span>
        <span style={{...styles.statusChip, background: item.status==='Evaluated'?'#E8F5E9':'#FFF3E0', color: item.status==='Evaluated'?'#4CAF50':'#F57C00'}}>{item.status}</span>
      </div>
    </div>
  );
}

function MedSimLogo() {
  return <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="12" fill="#7B5CFA"/><path d="M12 20h4l3-7 4 14 3-10 2 3h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

const styles = {
  shell:     { display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg-main)' },
  sidebar:   { width:220, background:'#fff', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'24px 0', flexShrink:0 },
  sideTop:   { display:'flex', flexDirection:'column', gap:32 },
  logo:      { display:'flex', alignItems:'center', gap:10, padding:'0 20px' },
  logoText:  { fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, color:'var(--purple-primary)' },
  nav:       { display:'flex', flexDirection:'column', gap:4, padding:'0 10px' },
  navBtn:    { display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:'var(--radius-md)', border:'none', background:'transparent', cursor:'pointer', fontSize:14, fontWeight:600, fontFamily:'var(--font-head)', color:'var(--text-mid)', transition:'var(--transition)', textAlign:'left' },
  navBtnActive: { background:'var(--purple-ultra)', color:'var(--purple-primary)' },
  navIcon:   { fontSize:18 },
  sideBottom: { padding:'0 16px', display:'flex', flexDirection:'column', gap:10 },
  studentChip: { display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'var(--bg-main)', borderRadius:'var(--radius-md)' },
  avatar:    { width:36, height:36, background:'var(--purple-primary)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontFamily:'var(--font-head)', fontSize:15, flexShrink:0 },
  studentName: { fontWeight:700, fontSize:13, fontFamily:'var(--font-head)', color:'var(--text-dark)' },
  studentId:  { fontSize:12, color:'var(--text-light)' },
  logoutBtn:  { border:'none', background:'transparent', color:'var(--text-light)', fontSize:13, cursor:'pointer', padding:'6px 0', textAlign:'left', fontFamily:'var(--font-body)' },
  main:      { flex:1, overflow:'auto', padding:'32px 36px', display:'flex', flexDirection:'column', gap:28, minHeight:0 },
  topBar:    { display:'flex', justifyContent:'space-between', alignItems:'flex-start' },
  welcome:   { fontFamily:'var(--font-head)', fontSize:28, fontWeight:800, color:'var(--text-dark)' },
  welcomeSub: { color:'var(--text-mid)', fontSize:15, marginTop:4 },
  statsRow:  { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 },
  statCard:  { padding:'20px 18px', display:'flex', flexDirection:'column', gap:8 },
  statIcon:  { width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 },
  statValue: { fontFamily:'var(--font-head)', fontSize:26, fontWeight:800, color:'var(--text-dark)' },
  statLabel: { fontSize:13, color:'var(--text-light)', fontWeight:500 },
  ctaCard:   { background:'linear-gradient(130deg,#7B5CFA 0%,#6C63FF 100%)', borderRadius:'var(--radius-xl)', padding:'32px 36px', display:'flex', justifyContent:'space-between', alignItems:'center', overflow:'visible', position:'relative', flexShrink:0 },
  ctaLeft:   { color:'#fff', maxWidth:380 },
  ctaBadge:  { display:'inline-block', background:'rgba(255,255,255,0.2)', borderRadius:99, padding:'3px 12px', fontSize:12, fontWeight:700, fontFamily:'var(--font-head)', marginBottom:10, backdropFilter:'blur(8px)' },
  ctaTitle:  { fontFamily:'var(--font-head)', fontSize:28, fontWeight:900, lineHeight:1.2 },
  ctaDesc:   { opacity:0.85, fontSize:14, marginTop:8, lineHeight:1.6 },
  ctaBtn:    { marginTop:20, background:'#fff', color:'var(--purple-primary)', boxShadow:'0 4px 20px rgba(0,0,0,0.15)' },
  ctaRight:  { position:'relative', width:180, height:80 },
  ctaCharacters: { display:'flex', justifyContent:'center' },
  ctaAvatar: { width:52, height:52, background:'rgba(255,255,255,0.25)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, backdropFilter:'blur(8px)', marginLeft:-8 },
  section:   { display:'flex', flexDirection:'column', gap:12 },
  sectionHeader: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  sectionTitle:  { fontFamily:'var(--font-head)', fontSize:18, fontWeight:800, color:'var(--text-dark)' },
  seeAll:    { border:'none', background:'transparent', color:'var(--purple-primary)', fontWeight:700, cursor:'pointer', fontSize:14, fontFamily:'var(--font-head)' },
  emptyState: { textAlign:'center', padding:'40px 0', color:'var(--text-light)', display:'flex', flexDirection:'column', alignItems:'center', gap:12, fontSize:15 },
  historyList: { display:'flex', flexDirection:'column', gap:8 },
  historyRow: { background:'#fff', borderRadius:'var(--radius-md)', padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid var(--border)', transition:'var(--transition)' },
  historyLeft: { display:'flex', alignItems:'center', gap:12 },
  historyDot: { width:8, height:8, borderRadius:'50%', background:'var(--purple-primary)', flexShrink:0 },
  historyPatient: { fontWeight:700, fontSize:14, fontFamily:'var(--font-head)', color:'var(--text-dark)' },
  historyDept: { fontSize:12, color:'var(--text-light)', marginTop:2 },
  historyRight: { display:'flex', alignItems:'center', gap:10 },
  gradeChip:  { padding:'2px 10px', borderRadius:99, fontSize:13, fontWeight:800, fontFamily:'var(--font-head)' },
  historyScore: { fontSize:14, fontWeight:700, color:'var(--text-mid)' },
  statusChip: { padding:'3px 10px', borderRadius:99, fontSize:12, fontWeight:600 },
};
