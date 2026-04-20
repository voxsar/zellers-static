import { useEffect, useState, useCallback } from 'react';
import api from '../api';

const STATUS_COLORS = {
	pending: '#f59e0b',
	processing: '#3b82f6',
	completed: '#22c55e',
	failed: '#ef4444',
};

function StatusBadge({ status }) {
	return (
		<span style={{
			display: 'inline-block',
			padding: '2px 10px',
			borderRadius: 12,
			fontSize: '0.75rem',
			fontWeight: 700,
			background: STATUS_COLORS[status] + '22',
			color: STATUS_COLORS[status],
			border: `1px solid ${STATUS_COLORS[status]}55`,
			textTransform: 'uppercase',
		}}>
			{status}
		</span>
	);
}

export default function QueuePage() {
	const [stats, setStats] = useState(null);
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [actionMsg, setActionMsg] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [retryingId, setRetryingId] = useState(null);

	const fetchData = useCallback(async () => {
		try {
			const params = new URLSearchParams({ limit: 100 });
			if (statusFilter) params.set('status', statusFilter);

			const [statsRes, jobsRes] = await Promise.all([
				api.get('/queue/stats'),
				api.get(`/queue/jobs?${params}`),
			]);
			setStats(statsRes.data.stats);
			setJobs(jobsRes.data.jobs || []);
			setError('');
		} catch {
			setError('Failed to load queue data');
		} finally {
			setLoading(false);
		}
	}, [statusFilter]);

	useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, 5000);
		return () => clearInterval(interval);
	}, [fetchData]);

	async function handleRestart() {
		try {
			await api.post('/queue/restart');
			setActionMsg('✅ Queue processor restarted');
			setTimeout(() => setActionMsg(''), 4000);
			fetchData();
		} catch {
			setActionMsg('❌ Failed to restart queue processor');
			setTimeout(() => setActionMsg(''), 4000);
		}
	}

	async function handleStop() {
		if (!window.confirm('Stop the queue processor? New jobs will not be picked up until restarted.')) return;
		try {
			await api.post('/queue/stop');
			setActionMsg('⏹️ Queue processor stopped');
			setTimeout(() => setActionMsg(''), 4000);
			fetchData();
		} catch {
			setActionMsg('❌ Failed to stop queue processor');
			setTimeout(() => setActionMsg(''), 4000);
		}
	}

	async function handleRetry(jobId) {
		setRetryingId(jobId);
		try {
			await api.post(`/queue/jobs/${jobId}/retry`);
			setActionMsg('🔄 Job queued for retry');
			setTimeout(() => setActionMsg(''), 4000);
			fetchData();
		} catch (err) {
			setActionMsg('❌ ' + (err?.response?.data?.message || 'Failed to retry job'));
			setTimeout(() => setActionMsg(''), 4000);
		} finally {
			setRetryingId(null);
		}
	}

	function fmt(d) {
		if (!d) return '—';
		return new Date(d).toLocaleTimeString();
	}

	return (
		<div>
			<div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
				<h1>Generation Queue</h1>
				<div style={{ display: 'flex', gap: 8 }}>
					<button
						onClick={handleRestart}
						style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
					>
						▶ Restart Queue
					</button>
					<button
						onClick={handleStop}
						style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444455', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
					>
						⏹ Stop Queue
					</button>
					<button
						onClick={fetchData}
						style={{ background: '#334155', color: '#94a3b8', border: '1px solid #475569', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
					>
						↻ Refresh
					</button>
				</div>
			</div>

			{actionMsg && (
				<div style={{ marginBottom: 16, padding: '10px 16px', background: '#1e293b', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', color: '#e2e8f0', border: '1px solid #334155' }}>
					{actionMsg}
				</div>
			)}

			{error && <div className="error-msg">{error}</div>}

			{/* Stats row */}
			{stats && (
				<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
					{[
						{ label: 'Pending', value: stats.pending, color: '#f59e0b' },
						{ label: 'Processing', value: stats.processing, color: '#3b82f6' },
						{ label: 'Completed', value: stats.completed, color: '#22c55e' },
						{ label: 'Failed', value: stats.failed, color: '#ef4444' },
						{ label: 'Active Jobs', value: `${stats.activeJobs} / ${stats.maxConcurrentJobs}`, color: stats.isProcessing ? '#22c55e' : '#64748b' },
					].map(({ label, value, color }) => (
						<div key={label} style={{ background: '#1e293b', border: `1px solid ${color}33`, borderRadius: 10, padding: '12px 20px', minWidth: 100, textAlign: 'center' }}>
							<div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
							<div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
						</div>
					))}
					<div style={{ background: '#1e293b', border: `1px solid #22c55e${stats.isProcessing ? 'ff' : '22'}`, borderRadius: 10, padding: '12px 20px', minWidth: 100, textAlign: 'center' }}>
						<div style={{ fontSize: '1.1rem', fontWeight: 800, color: stats.isProcessing ? '#22c55e' : '#ef4444' }}>
							{stats.isProcessing ? '● RUNNING' : '● STOPPED'}
						</div>
						<div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Processor</div>
					</div>
				</div>
			)}

			{/* Filter */}
			<div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
				<label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Filter by status:</label>
				{['', 'pending', 'processing', 'failed', 'completed'].map((s) => (
					<button
						key={s || 'all'}
						onClick={() => setStatusFilter(s)}
						style={{
							padding: '4px 14px',
							borderRadius: 20,
							border: `1px solid ${statusFilter === s ? '#3b82f6' : '#334155'}`,
							background: statusFilter === s ? '#3b82f633' : 'transparent',
							color: statusFilter === s ? '#3b82f6' : '#94a3b8',
							fontWeight: 600,
							fontSize: '0.78rem',
							cursor: 'pointer',
						}}
					>
						{s || 'All'}
					</button>
				))}
			</div>

			{loading ? <p>Loading...</p> : (
				<div style={{ overflowX: 'auto' }}>
					<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
						<thead>
							<tr style={{ background: '#1e293b', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
								{['#', 'Post ID', 'User', 'Phone', 'Flavour', 'Gender', 'Status', 'Progress', 'Stage', 'Error', 'Created', 'Started', 'Completed', 'Actions'].map((h) => (
									<th key={h} style={{ padding: '10px 10px', textAlign: 'left', fontWeight: 700, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{jobs.length === 0 && (
								<tr><td colSpan={14} style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>No jobs found</td></tr>
							)}
							{jobs.map((job, i) => (
								<tr key={job._id} style={{ borderBottom: '1px solid #1e293b', background: i % 2 === 0 ? '#0f172a' : '#111827' }}>
									<td style={{ padding: '8px 10px', color: '#64748b' }}>{i + 1}</td>
									<td style={{ padding: '8px 10px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#e2e8f0', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={job.postId}>{job.postId}</td>
									<td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{job.userId?.name || job.userId?.displayName || '—'}</td>
									<td style={{ padding: '8px 10px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.75rem' }}>{job.phoneNumber}</td>
									<td style={{ padding: '8px 10px', color: '#e2e8f0', fontWeight: 600 }}>{job.flavour}</td>
									<td style={{ padding: '8px 10px', color: '#94a3b8' }}>{job.gender}</td>
									<td style={{ padding: '8px 10px' }}><StatusBadge status={job.status} /></td>
									<td style={{ padding: '8px 10px', color: '#94a3b8' }}>{job.progress}%</td>
									<td style={{ padding: '8px 10px', color: '#64748b', fontSize: '0.72rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.currentStage || '—'}</td>
									<td style={{ padding: '8px 10px', color: '#ef4444', fontSize: '0.72rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={job.error || ''}>{job.error ? job.error.slice(0, 40) + (job.error.length > 40 ? '…' : '') : '—'}</td>
									<td style={{ padding: '8px 10px', color: '#64748b', whiteSpace: 'nowrap' }}>{fmt(job.createdAt)}</td>
									<td style={{ padding: '8px 10px', color: '#64748b', whiteSpace: 'nowrap' }}>{fmt(job.startedAt)}</td>
									<td style={{ padding: '8px 10px', color: '#64748b', whiteSpace: 'nowrap' }}>{fmt(job.completedAt)}</td>
									<td style={{ padding: '8px 10px' }}>
										{(job.status === 'failed' || job.status === 'completed' || job.status === 'processing') && (
											<button
												onClick={() => handleRetry(job._id)}
												disabled={retryingId === job._id}
												style={{
													background: job.status === 'processing' ? '#f59e0b22' : '#3b82f622',
													color: job.status === 'processing' ? '#f59e0b' : '#3b82f6',
													border: `1px solid ${job.status === 'processing' ? '#f59e0b44' : '#3b82f644'}`,
													borderRadius: 6,
													padding: '4px 12px',
													fontSize: '0.75rem',
													fontWeight: 700,
													cursor: 'pointer',
													whiteSpace: 'nowrap',
												}}
											>
												{retryingId === job._id ? '…' : job.status === 'processing' ? '↺ Force Retry' : '↺ Retry'}
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<p style={{ marginTop: 12, fontSize: '0.75rem', color: '#475569' }}>Auto-refreshes every 5 seconds. Showing up to 100 most recent jobs.</p>
		</div>
	);
}
