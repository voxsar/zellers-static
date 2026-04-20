import { useEffect, useState } from 'react';
import api from '../api';

function UserModal({ userId, onClose }) {
	const [user, setUser] = useState(null);
	useEffect(() => {
		api.get(`/users/${userId}`).then((r) => setUser(r.data.user || r.data));
	}, [userId]);

	const formatDate = (date) => {
		if (!date) return '-';
		return new Date(date).toLocaleString();
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()} style={{ minWidth: '600px', maxWidth: '800px' }}>
				<h2>User Details</h2>
				{!user ? <p>Loading...</p> : (
					<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
						{/* Basic Info */}
						<div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
							<h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Basic Information</h3>
							<div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', fontSize: '0.9rem' }}>
								<strong>Phone:</strong><span>{user.phone}</span>
								<strong>Name:</strong><span>{user.name || '-'}</span>
								<strong>Display Name:</strong><span>{user.displayName || '-'}</span>
								<strong>Gender:</strong><span>{user.gender || '-'}</span>
								<strong>Status:</strong>
								<span className={`badge ${user.completionStatus === 'completed' ? 'badge-green' :
									user.completionStatus === 'partial' ? 'badge-yellow' : 'badge-gray'
									}`}>{user.completionStatus || 'registered'}</span>
								<strong>Registered:</strong><span>{formatDate(user.createdAt)}</span>
								<strong>Last Updated:</strong><span>{formatDate(user.updatedAt)}</span>
							</div>
						</div>

						{/* Quiz Answers */}
						{user.quiz && (
							<div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
								<h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Quiz Answers</h3>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.9rem' }}>
									{user.quiz.answers && Array.isArray(user.quiz.answers) ? (
										user.quiz.answers.map((ans, idx) => (
											<div key={idx} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '8px' }}>
												<strong>{ans.q || `Question ${idx + 1}`}:</strong>
												<span>{ans.answer}</span>
											</div>
										))
									) : (
										Object.entries(user.quiz.answers || {}).map(([key, value]) => {
											const displayValue = typeof value === 'object' && value !== null
												? (value.answer || JSON.stringify(value))
												: Array.isArray(value)
													? value.join(', ')
													: String(value);
											return (
												<div key={key} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '8px' }}>
													<strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
													<span>{displayValue}</span>
												</div>
											);
										})
									)}
									<div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '8px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e0e7ff' }}>
										<strong>Submitted:</strong><span>{formatDate(user.quiz.createdAt)}</span>
									</div>
								</div>
							</div>
						)}

						{/* Post Info */}
						{user.post && (
							<div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px' }}>
								<h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Generated Post</h3>
								<div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', fontSize: '0.9rem' }}>
									<strong>Post ID:</strong><span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{user.post.postId}</span>
									<strong>Gender:</strong><span>{user.post.gender}</span>
									<strong>Active:</strong><span>{user.post.active ? 'Yes' : 'No'}</span>
									<strong>Votes:</strong><span>{user.post.voteCount || 0}</span>
									{user.post.imageUrl && (
										<>
											<strong>Image:</strong>
											<a href={user.post.imageUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>View Image</a>
										</>
									)}
									<strong>Created:</strong><span>{formatDate(user.post.createdAt)}</span>
								</div>
							</div>
						)}

						{/* Votes */}
						{user.votes && user.votes.length > 0 && (
							<div style={{ background: '#fef3f2', padding: '16px', borderRadius: '8px' }}>
								<h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Votes Cast ({user.votes.length})</h3>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', maxHeight: '150px', overflow: 'auto' }}>
									{user.votes.map((vote, idx) => (
										<div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
											<span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{vote.postId}</span>
											<span style={{ color: '#64748b' }}>{formatDate(vote.createdAt)}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Workflow Status */}
						{user.workflow && (
							<div style={{ background: '#faf5ff', padding: '16px', borderRadius: '8px' }}>
								<h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Workflow Progress</h3>
								<div style={{ fontSize: '0.9rem' }}>
									<div style={{ marginBottom: '12px' }}>
										<strong>Current Stage:</strong> <span style={{ marginLeft: '8px', padding: '2px 8px', background: '#e0e7ff', borderRadius: '4px' }}>{user.workflow.currentStage}</span>
									</div>
									<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
										{user.workflow.stages && user.workflow.stages.map((stage, idx) => (
											<div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', background: 'white', borderRadius: '4px' }}>
												<span style={{
													width: '8px',
													height: '8px',
													borderRadius: '50%',
													background: stage.status === 'completed' ? '#22c55e' :
														stage.status === 'failed' ? '#ef4444' :
															stage.status === 'skipped' ? '#94a3b8' : '#e2e8f0',
													flexShrink: 0
												}}></span>
												<span style={{ flex: 1 }}>{stage.stage}</span>
												<span style={{ fontSize: '0.8rem', color: '#64748b' }}>{stage.status}</span>
												{stage.completedAt && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatDate(stage.completedAt)}</span>}
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				)}
				<div className="form-actions" style={{ marginTop: '20px' }}>
					<button className="btn btn-secondary" onClick={onClose}>Close</button>
				</div>
			</div>
		</div>
	);
}

export default function UsersPage() {
	const [users, setUsers] = useState([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [filter, setFilter] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [viewUserId, setViewUserId] = useState(null);
	const limit = 20;

	const fetchUsers = () => {
		setLoading(true);
		const params = { page, limit };
		if (filter) params.filter = filter;
		if (searchQuery) params.search = searchQuery;
		api.get('/users', { params })
			.then((r) => {
				setUsers(r.data.users || []);
				setTotal(r.data.pagination?.total || 0);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => { fetchUsers(); }, [page, filter, searchQuery]);

	const handleSearch = (e) => {
		e.preventDefault();
		setSearchQuery(searchInput);
		setPage(1);
	};

	const clearSearch = () => {
		setSearchInput('');
		setSearchQuery('');
		setPage(1);
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Delete this user?')) return;
		await api.delete(`/users/${id}`);
		fetchUsers();
	};

	const totalPages = Math.ceil(total / limit);

	return (
		<div>
			<div className="page-header">
				<h1>Users ({total})</h1>
			</div>
			
			{/* Search Bar */}
			<form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<input
						type="text"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder="Search by name, phone, or display name..."
						style={{
							flex: 1,
							padding: '8px 12px',
							border: '1px solid #d1d5db',
							borderRadius: 6,
							fontSize: 14
						}}
					/>
					<button type="submit" className="btn btn-primary btn-sm">
						🔍 Search
					</button>
					{searchQuery && (
						<button type="button" className="btn btn-secondary btn-sm" onClick={clearSearch}>
							✕ Clear
						</button>
					)}
				</div>
				{searchQuery && (
					<div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
						Searching for: <strong>{searchQuery}</strong>
					</div>
				)}
			</form>

			<div className="filter-group">
				{['', 'completed', 'partial', 'registered'].map((f) => (
					<button
						key={f}
						className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
						onClick={() => { setFilter(f); setPage(1); }}
					>
						{f || 'All'}
					</button>
				))}
			</div>
			<div className="card">
				<div className="table-container">
					{loading ? <p>Loading...</p> : (
						<table>
							<thead>
								<tr>
									<th>Phone</th>
									<th>Name</th>
									<th>Stage</th>
									<th>Status</th>
									<th>Created</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.map((u) => (
									<tr key={u._id}>
										<td>{u.phone}</td>
										<td>
											<div style={{ fontWeight: 500 }}>{u.name || u.displayName || '-'}</div>
											{u.displayName && u.displayName !== u.name && (
												<div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.displayName}</div>
											)}
										</td>
										<td>{u.workflowStage || '-'}</td>
										<td>
											<span className={`badge ${u.completionStatus === 'completed' ? 'badge-green' :
												u.completionStatus === 'partial' ? 'badge-yellow' : 'badge-gray'
												}`}>{u.completionStatus || 'registered'}</span>
										</td>
										<td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
										<td style={{ display: 'flex', gap: 6 }}>
											<button className="btn btn-secondary btn-sm" onClick={() => setViewUserId(u._id)}>View</button>
											<button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button>
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
			{viewUserId && <UserModal userId={viewUserId} onClose={() => setViewUserId(null)} />}
		</div>
	);
}
