import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    api.get('/workflows', { params: { page, limit } })
      .then((r) => {
        setWorkflows(r.data.workflows || []);
        setTotal(r.data.pagination?.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="page-header">
        <h1>Workflows ({total})</h1>
      </div>
      <div className="card">
        <div className="table-container">
          {loading ? <p>Loading...</p> : (
            <table>
              <thead>
                <tr>
                  <th>User Phone</th>
                  <th>User Name</th>
                  <th>Current Stage</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((w) => (
                  <tr key={w._id || w.userId}>
                    <td>{w.userId?.phone || '-'}</td>
                    <td>{w.userId?.displayName || w.userId?.name || '-'}</td>
                    <td>{w.currentStage || '-'}</td>
                    <td>{w.updatedAt ? new Date(w.updatedAt).toLocaleDateString() : '-'}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/workflows/${w.userId?._id || w._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="pagination">
          <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <span>Page {page} of {totalPages || 1}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}
