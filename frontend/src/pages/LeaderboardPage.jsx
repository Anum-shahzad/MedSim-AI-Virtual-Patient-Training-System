import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { historyAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { student } = useAuth();
  const navigate    = useNavigate();

  useEffect(() => {
    historyAPI.leaderboard().then(r => { setEntries(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h1 style={styles.title}>🏆 Leaderboard</h1>
        <p style={styles.sub}>Top scores across all students</p>

        {loading && <div style={{display:'flex',justifyContent:'center',padding:60}}><Spinner /></div>}

        {!loading && (
          <div style={styles.list}>
            {entries.map((e, i) => {
              const gradeColor = {A:'#4CAF50',B:'#8BC34A',C:'#F57C00',D:'#FF7043',F:'#EF5350'}[e.grade]||'#9E9E9E';
              const isMe = e.studentName === student?.fullName;
              const medal = ['🥇','🥈','🥉'][i] || `#${i+1}`;
              return (
                <div key={i} className="card" style={{...styles.row, ...(isMe ? styles.myRow : {})}}>
                  <div style={styles.rank}>{medal}</div>
                  <div style={styles.info}>
                    <div style={styles.name}>{e.studentName} {isMe && <span style={styles.youBadge}>You</span>}</div>
                    <div style={styles.meta}>{e.universityName} · {e.department}</div>
                  </div>
                  <div style={{...styles.grade, color: gradeColor, background: gradeColor+'18'}}>{e.grade}</div>
                  <div style={styles.score}>{e.totalScore?.toFixed(1)}%</div>
                </div>
              );
            })}
            {entries.length === 0 && <div style={styles.empty}><span style={{fontSize:40}}>🏆</span><p>No scores yet. Be the first!</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return <div style={{width:32,height:32,border:'4px solid var(--purple-pale)',borderTopColor:'var(--purple-primary)',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>;
}

const styles = {
  page:      { minHeight:'100vh', background:'var(--bg-main)', padding:'32px 24px' },
  container: { maxWidth:640, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 },
  back:      { border:'none', background:'transparent', color:'var(--text-mid)', fontSize:14, cursor:'pointer', fontWeight:600, fontFamily:'var(--font-head)', alignSelf:'flex-start', padding:0 },
  title:     { fontFamily:'var(--font-head)', fontSize:28, fontWeight:800, color:'var(--text-dark)' },
  sub:       { color:'var(--text-mid)', fontSize:15, marginTop:-12 },
  list:      { display:'flex', flexDirection:'column', gap:10 },
  row:       { padding:'14px 20px', display:'flex', alignItems:'center', gap:14 },
  myRow:     { border:'2px solid var(--purple-primary)', background:'var(--purple-ultra)' },
  rank:      { fontSize:22, minWidth:36, textAlign:'center' },
  info:      { flex:1 },
  name:      { fontFamily:'var(--font-head)', fontWeight:700, fontSize:15, color:'var(--text-dark)', display:'flex', alignItems:'center', gap:8 },
  meta:      { fontSize:13, color:'var(--text-light)', marginTop:2 },
  grade:     { width:36, height:36, borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontSize:17, fontWeight:900 },
  score:     { fontFamily:'var(--font-head)', fontWeight:800, fontSize:18, color:'var(--text-dark)', minWidth:56, textAlign:'right' },
  youBadge:  { background:'var(--purple-pale)', color:'var(--purple-primary)', borderRadius:99, padding:'1px 8px', fontSize:11, fontWeight:700 },
  empty:     { textAlign:'center', padding:'40px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:12, color:'var(--text-light)', fontSize:15 },
};
