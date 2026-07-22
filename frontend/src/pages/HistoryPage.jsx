import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { historyAPI, sessionAPI } from '../api/client';
import { useSession } from '../context/SessionContext';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [resumingId, setResumingId] = useState(null);
  const navigate = useNavigate();
  const { startSession } = useSession();

  useEffect(() => {
    historyAPI.list().then(r => { setHistory(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (caseId) => {
    if (!window.confirm('Delete this case from history?')) return;
    setDeletingId(caseId);
    try {
      await historyAPI.delete(caseId);
      setHistory(prev => prev.filter(h => h.caseId !== caseId));
    } catch {
      alert('Could not delete this case. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleResume = async (h) => {
    setResumingId(h.caseId);
    try {
      // Start a fresh session with the same patient/department
      const res = await sessionAPI.start(h.patientCharacter, h.department);
      startSession(res.data);
      navigate('/consult');
    } catch {
      alert('Could not resume this case. Please try again.');
      setResumingId(null);
    }
  };

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.back} onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <div style={styles.headerRow}>
            <div>
              <h1 style={styles.title}>My Case History</h1>
              <p style={styles.sub}>{history.length} case{history.length !== 1 ? 's' : ''} total</p>
            </div>
            {history.length > 0 && (
              <button style={styles.clearAllBtn}
                onClick={async () => {
                  if (!window.confirm('Delete ALL case history? This cannot be undone.')) return;
                  for (const h of history) {
                    try { await historyAPI.delete(h.caseId); } catch {}
                  }
                  setHistory([]);
                }}>
                🗑 Clear All History
              </button>
            )}
          </div>
        </div>

        {loading && <div style={styles.loading}><Spinner /></div>}

        {!loading && history.length === 0 && (
          <div style={styles.empty}>
            <span style={{ fontSize: 48 }}>📋</span>
            <p>No cases yet. Start your first consultation!</p>
            <button className="btn-primary" onClick={() => navigate('/setup')}>Start Now</button>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div style={styles.list}>
            {history.map(h => {
              const grade = h.grade || '—';
              const gradeColor = { A: '#4CAF50', B: '#8BC34A', C: '#F57C00', D: '#FF7043', F: '#EF5350' }[grade] || '#9E9E9E';
              const isInProgress = h.status === 'InProgress' || !h.totalScore;
              const isDeleting   = deletingId === h.caseId;
              const isResuming   = resumingId === h.caseId;

              return (
                <div key={h.caseId} className="card" style={styles.row}>
                  <div style={{ ...styles.gradeBox, background: gradeColor + '18', color: gradeColor }}>
                    {isInProgress ? '⏸' : grade}
                  </div>
                  <div style={styles.rowInfo}>
                    <div style={styles.rowTitle}>{h.patientCharacter}</div>
                    <div style={styles.rowMeta}>{h.department} · {h.ageGroup}</div>
                  </div>
                  <div style={styles.rowScore}>
                    <div style={styles.rowScoreVal}>{h.totalScore ? `${h.totalScore.toFixed(1)}%` : '—'}</div>
                    <div style={{ ...styles.rowStatus, background: isInProgress ? '#FFF3E0' : '#E8F5E9', color: isInProgress ? '#F57C00' : '#4CAF50' }}>
                      {h.status || 'InProgress'}
                    </div>
                  </div>
                  <div style={styles.rowDate}>
                    {h.submittedAt ? new Date(h.submittedAt).toLocaleDateString() : 'In Progress'}
                  </div>
                  <div style={styles.rowActions}>
                    {isInProgress && (
                      <button style={styles.resumeBtn} onClick={() => handleResume(h)} disabled={isResuming || isDeleting}>
                        {isResuming ? <MiniSpinner /> : '▶ Resume'}
                      </button>
                    )}
                    <button style={styles.deleteBtn} onClick={() => handleDelete(h.caseId)} disabled={isDeleting || isResuming}>
                      {isDeleting ? <MiniSpinner red /> : '🗑'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return <div style={{ width: 32, height: 32, border: '4px solid var(--purple-pale)', borderTopColor: 'var(--purple-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />;
}
function MiniSpinner({ red }) {
  return <div style={{ width: 14, height: 14, border: `3px solid ${red ? '#FFCDD2' : 'rgba(123,92,250,0.3)'}`, borderTopColor: red ? '#EF5350' : 'var(--purple-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />;
}

const styles = {
  page:        { minHeight: '100vh', background: 'var(--bg-main)', padding: '32px 24px' },
  container:   { maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 },
  header:      { display: 'flex', flexDirection: 'column', gap: 4 },
  headerRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' },
  back:        { border: 'none', background: 'transparent', color: 'var(--text-mid)', fontSize: 14, cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-head)', alignSelf: 'flex-start', padding: 0, marginBottom: 8 },
  title:       { fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: 'var(--text-dark)' },
  sub:         { color: 'var(--text-mid)', fontSize: 15 },
  clearAllBtn: { background: '#FFF3E0', border: '1.5px solid #FFE0B2', color: '#E65100', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', cursor: 'pointer', whiteSpace: 'nowrap' },
  loading:     { display: 'flex', justifyContent: 'center', padding: 60 },
  empty:       { textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: 'var(--text-light)', fontSize: 15 },
  list:        { display: 'flex', flexDirection: 'column', gap: 10 },
  row:         { padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  gradeBox:    { width: 44, height: 44, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 900, flexShrink: 0 },
  rowInfo:     { flex: 1, minWidth: 120 },
  rowTitle:    { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15, color: 'var(--text-dark)' },
  rowMeta:     { fontSize: 13, color: 'var(--text-light)', marginTop: 2 },
  rowScore:    { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 },
  rowScoreVal: { fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: 'var(--text-dark)' },
  rowStatus:   { padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 },
  rowDate:     { fontSize: 13, color: 'var(--text-light)', minWidth: 90, textAlign: 'right' },
  rowActions:  { display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 },
  resumeBtn:   { background: 'var(--purple-ultra)', border: '1.5px solid var(--purple-primary)', color: 'var(--purple-primary)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-head)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  deleteBtn:   { background: '#FFF5F5', border: '1.5px solid #FFCDD2', color: '#EF5350', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 34 },
};
