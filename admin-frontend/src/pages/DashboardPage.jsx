import { useEffect, useState } from 'react';
import api from '../api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/stats')
      .then((res) => setStats(res.data.stats))
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const statItems = stats ? [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Total Posts', value: stats.totalPosts },
    { label: 'Total Votes', value: stats.totalVotes },
    { label: 'Total Quizzes', value: stats.totalQuizzes },
    { label: 'Completed Posts', value: stats.usersCompletedPost },
    { label: 'Completed Quiz', value: stats.usersCompletedQuiz },
    { label: 'With Profile', value: stats.usersWithProfile },
    { label: 'Partial', value: stats.partialCompletions },
  ] : [];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      {loading && <p>Loading...</p>}
      {error && <div className="error-msg">{error}</div>}
      {stats && (
        <div className="stats-grid">
          {statItems.map(({ label, value }) => (
            <div key={label} className="stat-card">
              <div className="value">{value ?? 0}</div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
