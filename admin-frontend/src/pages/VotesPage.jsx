import { useState, useEffect } from 'react';
import api from '../api';

export default function VotesPage() {
  const [votes, setVotes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/votes?page=${page}&limit=20`);
      setVotes(data.votes || []);
      setPagination(data.pagination || { page: 1, totalPages: 1 });
    } catch { setError('Failed to load votes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vote?')) return;
    try { await api.delete(`/votes/${id}`); load(pagination.page); } catch { setError('Delete failed'); }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Votes</h1>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {loading ? <p>Loading…</p> : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.1)' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>{['User Phone', 'Display Name', 'Post ID', 'Created At', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {votes.map(v => (
                <tr key={v._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>{v.userId?.phone || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>{v.userId?.displayName || '—'}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 13 }}>{v.postId}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{new Date(v.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleDelete(v._id)} style={{ padding: '4px 12px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => load(p)} style={{ padding: '4px 12px', background: p === pagination.page ? '#3b82f6' : '#f1f5f9', color: p === pagination.page ? '#fff' : '#334155', border: 'none', borderRadius: 4, cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
