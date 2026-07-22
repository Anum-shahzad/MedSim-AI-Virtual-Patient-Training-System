import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const DIMS = [
  { key:'scoreHistoryTaking', label:'History Taking',       max:25, icon:'📋' },
  { key:'scorePhysicalExam',  label:'Physical Examination', max:20, icon:'🩺' },
  { key:'scoreInvestigation', label:'Investigation Orders', max:20, icon:'🧪' },
  { key:'scoreDiagnosis',     label:'Diagnosis Accuracy',   max:20, icon:'🎯' },
  { key:'scorePrescription',  label:'Prescription Quality', max:15, icon:'💊' },
];


export default function ReportPage() {
  const { report, session } = useSession();
  const navigate = useNavigate();

  if (!report) {
    return (
      <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
        <span style={{fontSize:40}}>📊</span>
        <p style={{color:'var(--text-mid)'}}>No report found. Please complete a consultation first.</p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  const passed = report.passed;
  const grade  = report.grade;
  const gradeColor = { A:'#4CAF50',B:'#8BC34A',C:'#F57C00',D:'#FF7043',F:'#EF5350' }[grade] || '#9E9E9E';
  const correctActions = tryParseJson(report.correctActions, []);
  const missedActions  = tryParseJson(report.missedActions,  []);

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>
        {/* Header */}
        <div style={{...styles.scoreHeader, background: passed?'linear-gradient(135deg,#4CAF50,#66BB6A)':'linear-gradient(135deg,#EF5350,#EF9A9A)'}}>
          <div style={styles.gradeCircle}>
            <span style={styles.gradeLetter}>{grade}</span>
          </div>
          <div style={styles.headerText}>
            <h1 style={styles.scoreTitle}>{report.totalScore?.toFixed(1)} / 100</h1>
            <p style={styles.scoreSub}>{passed ? '🎉 Passed — Well done!' : '📚 Failed — Keep practicing'}</p>
            <p style={styles.caseInfo}>{session?.patientCharacter} · {session?.department}</p>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Dimension Scores */}
          <div className="card" style={styles.section}>
            <h3 style={styles.sectionTitle}>Score Breakdown</h3>
            {DIMS.map(dim => {
              const score = report[dim.key] || 0;
              const pct   = (score / dim.max) * 100;
              const color = pct >= 70 ? '#4CAF50' : pct >= 50 ? '#F57C00' : '#EF5350';
              return (
                <div key={dim.key} style={styles.dimRow}>
                  <div style={styles.dimLeft}>
                    <span style={styles.dimIcon}>{dim.icon}</span>
                    <span style={styles.dimLabel}>{dim.label}</span>
                  </div>
                  <div style={styles.dimRight}>
                    <div style={styles.dimBar}>
                      <div style={{...styles.dimFill, width:`${pct}%`, background:color}}/>
                    </div>
                    <span style={{...styles.dimScore, color}}>{score}/{dim.max}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Feedback */}
          <div className="card" style={styles.section}>
            <h3 style={styles.sectionTitle}>AI Feedback</h3>
            <p style={styles.feedbackText}>{report.aiFeedback}</p>
            <div style={styles.divider}/>
            <h4 style={styles.subTitle}>Expert Model Answer</h4>
            <p style={styles.feedbackText}>{report.modelAnswer}</p>
          </div>

          {/* Correct Actions */}
          <div className="card" style={styles.section}>
            <h3 style={{...styles.sectionTitle, color:'#4CAF50'}}>✓ Correct Actions</h3>
            <div style={styles.actionList}>
              {correctActions.length === 0
                ? <p style={{color:'var(--text-light)',fontSize:14}}>No data available.</p>
                : correctActions.map((a,i) => (
                    <div key={i} style={{...styles.actionItem, background:'#E8F5E9', borderColor:'#C8E6C9'}}>
                      <span style={{color:'#4CAF50',fontWeight:700}}>✓</span>
                      <span style={{fontSize:14}}>{a}</span>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Missed Actions */}
          <div className="card" style={styles.section}>
            <h3 style={{...styles.sectionTitle, color:'#EF5350'}}>✗ Missed / Incorrect</h3>
            <div style={styles.actionList}>
              {missedActions.length === 0
                ? <p style={{color:'var(--text-light)',fontSize:14}}>Nothing missed!</p>
                : missedActions.map((a,i) => (
                    <div key={i} style={{...styles.actionItem, background:'#FFEBEE', borderColor:'#FFCDD2'}}>
                      <span style={{color:'#EF5350',fontWeight:700}}>✗</span>
                      <span style={{fontSize:14}}>{a}</span>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={styles.actions}>
          <button className="btn-secondary" onClick={() => navigate('/setup')}>Retry Case</button>
          <button className="btn-secondary" onClick={() => navigate('/history')}>View History</button>
          <button
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg,#1565C0,#1976D2)' }}
            onClick={async () => {
              const caseId = report?.caseId;
              if (!caseId) { alert('No case ID found'); return; }
              try {
                const token = localStorage.getItem('medsim_token');
                const res = await fetch('http://localhost:7000/api/history/export-pdf', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({ caseId }),
                });
                if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `MedSim_Report_Case${caseId}.pdf`; a.click();
                URL.revokeObjectURL(url);
              } catch (e) { alert('PDF export failed: ' + e.message); }
            }}
          >
            ⬇ Download PDF
          </button>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

function tryParseJson(val, fallback) {
  try { return typeof val === 'string' ? JSON.parse(val) : (val || fallback); }
  catch { return fallback; }
}

const styles = {
  page:      { minHeight:'100vh', background:'var(--bg-main)', padding:'32px 24px' },
  container: { maxWidth:900, margin:'0 auto', display:'flex', flexDirection:'column', gap:24 },
  scoreHeader: { borderRadius:'var(--radius-xl)', padding:'32px 36px', display:'flex', alignItems:'center', gap:24, color:'#fff' },
  gradeCircle: { width:80, height:80, background:'rgba(255,255,255,0.25)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, backdropFilter:'blur(8px)' },
  gradeLetter: { fontFamily:'var(--font-head)', fontSize:40, fontWeight:900 },
  headerText:  { display:'flex', flexDirection:'column', gap:4 },
  scoreTitle:  { fontFamily:'var(--font-head)', fontSize:36, fontWeight:900 },
  scoreSub:    { fontSize:17, opacity:0.9 },
  caseInfo:    { fontSize:14, opacity:0.75 },
  grid:      { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 },
  section:   { padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 },
  sectionTitle: { fontFamily:'var(--font-head)', fontSize:16, fontWeight:800, color:'var(--text-dark)' },
  subTitle:  { fontFamily:'var(--font-head)', fontSize:14, fontWeight:700, color:'var(--text-dark)' },
  dimRow:    { display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 },
  dimLeft:   { display:'flex', alignItems:'center', gap:8, flex:1 },
  dimIcon:   { fontSize:18, flexShrink:0 },
  dimLabel:  { fontSize:14, fontWeight:600, fontFamily:'var(--font-head)', color:'var(--text-dark)' },
  dimRight:  { display:'flex', alignItems:'center', gap:10, flex:1 },
  dimBar:    { flex:1, height:8, background:'var(--border)', borderRadius:99, overflow:'hidden' },
  dimFill:   { height:'100%', borderRadius:99, transition:'width 0.6s ease' },
  dimScore:  { fontSize:13, fontWeight:800, fontFamily:'var(--font-head)', minWidth:36, textAlign:'right' },
  feedbackText: { fontSize:14, lineHeight:1.7, color:'var(--text-dark)' },
  divider:   { height:1, background:'var(--border)' },
  actionList: { display:'flex', flexDirection:'column', gap:8 },
  actionItem: { display:'flex', gap:10, alignItems:'flex-start', padding:'10px 12px', borderRadius:'var(--radius-sm)', border:'1px solid' },
  actions:   { display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', paddingBottom:32 },
};
