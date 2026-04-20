import { useState, useEffect } from 'react';
import api from '../api';

const APPROVAL_TABS = [
	{ key: 'all', label: 'All' },
	{ key: 'pending', label: 'Pending' },
	{ key: 'approved', label: 'Approved' },
	{ key: 'rejected', label: 'Rejected' },
	{ key: 'not_submitted', label: 'Not Submitted' },
	{ key: 'ns_reminded', label: 'NS Reminded' },
	{ key: 'nsr_clicked', label: 'NSR Clicked' },
];

export default function PostsPage() {
	const [posts, setPosts] = useState([]);
	const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [perPage, setPerPage] = useState(20);
	const [editModal, setEditModal] = useState(null);
	const [editForm, setEditForm] = useState({});
	const [saving, setSaving] = useState(false);
	const [approvalFilter, setApprovalFilter] = useState('all');
	const [approving, setApproving] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [stagesModal, setStagesModal] = useState(null); // { postId, stages, uploadedImageUrl }
	const [loadingStages, setLoadingStages] = useState(false);
	const [restartModal, setRestartModal] = useState(null); // { postId, userId, currentStage }
	const [restartStage, setRestartStage] = useState('photo_upload');
	const [restarting, setRestarting] = useState(false);
	const [reminding, setReminding] = useState(null); // postId currently being reminded
	const [bulkReminderModal, setBulkReminderModal] = useState(false);
	const [reminderMessage, setReminderMessage] = useState('');
	const [bulkSending, setBulkSending] = useState(false);
	const [bulkResult, setBulkResult] = useState(null);
	const [votingAnnouncementModal, setVotingAnnouncementModal] = useState(false);
	const [votingFlyerUrl, setVotingFlyerUrl] = useState('');
	const [votingSending, setVotingSending] = useState(false);
	const [votingResult, setVotingResult] = useState(null);

	const load = async (page = 1) => {
		try {
			setLoading(true);
			const params = { page, limit: perPage };
			if (searchQuery) params.search = searchQuery;
			const { data } = await api.get('/posts', { params });
			let allPosts = data.posts || [];
			// Client-side filter by approval status / submission state
			if (approvalFilter === 'not_submitted') {
				allPosts = allPosts.filter(p => p.generationStatus === 'completed' && !p.submitted);
			} else if (approvalFilter === 'ns_reminded') {
				allPosts = allPosts.filter(p => !p.submitted && p.adminReminderSent);
			} else if (approvalFilter === 'nsr_clicked') {
				allPosts = allPosts.filter(p => !p.submitted && p.reminderLinkClicked);
			} else if (approvalFilter !== 'all') {
				allPosts = allPosts.filter(p => (p.approvalStatus || 'pending') === approvalFilter);
			}
			setPosts(allPosts);
			setPagination(data.pagination || { page: 1, totalPages: 1 });
		} catch { setError('Failed to load posts'); }
		finally { setLoading(false); }
	};

	useEffect(() => { load(); }, [approvalFilter, searchQuery, perPage]);

	const handleSearch = (e) => {
		e.preventDefault();
		setSearchQuery(searchInput);
		setPagination({ ...pagination, page: 1 });
	};

	const clearSearch = () => {
		setSearchInput('');
		setSearchQuery('');
	};

	const openEdit = (post) => {
		setEditForm({ flavor: post.flavor || '', gender: post.gender || '' });
		setEditModal(post);
		setError('');
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			await api.put(`/posts/${editModal.postId}`, editForm);
			setEditModal(null);
			load(pagination.page);
		} catch (e) { setError(e?.response?.data?.message || 'Save failed'); }
		finally { setSaving(false); }
	};

	const handleDelete = async (postId) => {
		if (!window.confirm('Delete this post?')) return;
		try { await api.delete(`/posts/${postId}`); load(pagination.page); } catch { setError('Delete failed'); }
	};

	const handleApproval = async (postId, action) => {
		setApproving(postId);
		try {
			await api.post(`/posts/${postId}/${action}`);
			load(pagination.page);
		} catch (e) {
			setError(e?.response?.data?.message || `${action} failed`);
		} finally {
			setApproving(null);
		}
	};

	const STAGE_OPTIONS = [
		{ value: 'photo_upload', label: '1 — Photo Upload' },
		{ value: 'fantasy_style', label: '2 — Style Transfer (Kling AI)' },
		{ value: 'face_swap', label: '3 — Face Swap (Remaker)' },
		{ value: 'bg_removal_gen', label: '4 — Background Removal' },
		{ value: 'branded_composites', label: '5 — Composite & Frame' },
	];

	const openRestart = (post) => {
		setRestartStage('photo_upload');
		setRestartModal({ postId: post.postId, userId: post.user?._id });
		setError('');
	};

	const handleRestart = async () => {
		if (!restartModal) return;
		setRestarting(true);
		try {
			await api.post(`/workflows/${restartModal.userId}/retrigger`, { fromStage: restartStage });
			setRestartModal(null);
			load(pagination.page);
		} catch (e) {
			setError(e?.response?.data?.message || 'Restart failed');
		} finally {
			setRestarting(false);
		}
	};

	const handleSendReminder = async (postId, customMessage) => {
		setReminding(postId);
		try {
			await api.post(`/posts/${postId}/send-reminder`, { message: customMessage || undefined });
			load(pagination.page);
		} catch (e) {
			setError(e?.response?.data?.message || 'Failed to send reminder');
		} finally {
			setReminding(null);
		}
	};

	const openVotingAnnouncement = () => {
		setVotingFlyerUrl('');
		setVotingResult(null);
		setVotingAnnouncementModal(true);
	};

	const handleVotingAnnouncement = async () => {
		setVotingSending(true);
		setVotingResult(null);
		try {
			const { data } = await api.post('/posts/bulk-voting-announcement', { imageUrl: votingFlyerUrl || undefined });
			setVotingResult(data);
		} catch (e) {
			setError(e?.response?.data?.message || 'Voting announcement failed');
		} finally {
			setVotingSending(false);
		}
	};

	const openBulkReminder = () => {
		const campaignUrl = 'https://aiavuruduwithzellers.com/campaign';
		setReminderMessage(`Hi {name}! Don't forget to submit your Zellers AI Avurudu Avatar for the competition!\n\nClick here to view and submit your photo:\n${campaignUrl}\n\n(Log in with your phone number to continue)`);
		setBulkResult(null);
		setBulkReminderModal(true);
	};

	const handleBulkRemind = async () => {
		setBulkSending(true);
		setBulkResult(null);
		try {
			const { data } = await api.post('/posts/bulk-remind', { message: reminderMessage || undefined });
			setBulkResult(data);
			load(pagination.page);
		} catch (e) {
			setError(e?.response?.data?.message || 'Bulk remind failed');
		} finally {
			setBulkSending(false);
		}
	};

	const openStages = async (postId) => {
		setLoadingStages(true);
		try {
			const { data } = await api.get(`/posts/${postId}/stages`);
			console.log('Stages API response:', JSON.stringify(data, null, 2));
			if (data.success) {
				setStagesModal({
					postId,
					stages: data.stages || [],
					uploadedImageUrl: data.uploadedImageUrl,
					referenceImageUrl: data.referenceImageUrl || null,
				});
			} else {
				setError('No stage images available for this post');
			}
		} catch (e) {
			console.error('Stages API error:', e);
			setError(e?.response?.data?.message || 'Failed to load stage images');
		} finally {
			setLoadingStages(false);
		}
	};

	const genderBadge = (g) => (
		<span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, background: g === 'male' ? '#dbeafe' : '#fce7f3', color: g === 'male' ? '#1e40af' : '#9d174d' }}>{g || '—'}</span>
	);

	const approvalBadge = (status) => {
		const styles = {
			approved: { background: '#dcfce7', color: '#166534' },
			rejected: { background: '#fee2e2', color: '#991b1b' },
			pending: { background: '#fef9c3', color: '#854d0e' },
		};
		const s = styles[status] || styles.pending;
		return <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600, ...s }}>{status || 'pending'}</span>;
	};

	return (
		<div>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
				<h1 style={{ margin: 0 }}>Posts</h1>
				<div style={{ display: 'flex', gap: 8 }}>
					<button
						onClick={openVotingAnnouncement}
						style={{ padding: '8px 18px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
					>
						🗳️ Voting Announcement
					</button>
					<button
						onClick={openBulkReminder}
						style={{ padding: '8px 18px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
					>
						📣 Bulk Remind Unsubmitted
					</button>
				</div>
			</div>

			{/* Search Bar */}
			<form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<input
						type="text"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder="Search by name, phone, chocolate flavor, or post number..."
						style={{
							flex: 1,
							padding: '8px 12px',
							border: '1px solid #d1d5db',
							borderRadius: 6,
							fontSize: 14
						}}
					/>
					<button type="submit" style={{
						padding: '8px 16px',
						background: '#3b82f6',
						color: '#fff',
						border: 'none',
						borderRadius: 6,
						cursor: 'pointer',
						fontWeight: 600,
						fontSize: 13
					}}>
						🔍 Search
					</button>
					{searchQuery && (
						<button type="button" onClick={clearSearch} style={{
							padding: '8px 16px',
							background: '#64748b',
							color: '#fff',
							border: 'none',
							borderRadius: 6,
							cursor: 'pointer',
							fontWeight: 600,
							fontSize: 13
						}}>
							✕ Clear
						</button>
					)}
					<select
						value={perPage}
						onChange={(e) => { setPerPage(Number(e.target.value)); setPagination(p => ({ ...p, page: 1 })); }}
						style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
					>
						<option value={10}>10 / page</option>
						<option value={20}>20 / page</option>
						<option value={50}>50 / page</option>
						<option value={200}>All</option>
					</select>
				</div>
				{searchQuery && (
					<div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
						Searching for: <strong>{searchQuery}</strong>
					</div>
				)}
			</form>

			{/* Approval filter tabs */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
				{APPROVAL_TABS.map(tab => (
					<button
						key={tab.key}
						onClick={() => setApprovalFilter(tab.key)}
						style={{
							padding: '6px 16px',
							background: approvalFilter === tab.key ? '#3b82f6' : '#f1f5f9',
							color: approvalFilter === tab.key ? '#fff' : '#334155',
							border: 'none',
							borderRadius: 6,
							cursor: 'pointer',
							fontWeight: approvalFilter === tab.key ? 700 : 400,
							fontSize: 13,
						}}
					>
						{tab.label}
					</button>
				))}
			</div>

			{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
			{loading ? <p>Loading…</p> : (
				<>
					<table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.1)' }}>
						<thead style={{ background: '#f8fafc' }}>
							<tr>{['#', 'User', 'Uploaded', 'Final', 'Status', 'Votes', 'Rank', 'Actions'].map(h => (
								<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
							))}</tr>
						</thead>
						<tbody>
							{posts.map(p => (
								<tr key={p._id || p.postId} style={{ borderBottom: '1px solid #f1f5f9' }}>
									<td style={{ padding: '12px 16px' }}>
										<div style={{ fontWeight: 700, fontSize: 16 }}>#{p.postNumber}</div>
										<div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', marginTop: 2 }}>{p.postId}</div>
										<div style={{ marginTop: 4 }}>{genderBadge(p.gender)}</div>
									</td>
									<td style={{ padding: '12px 16px', fontSize: 13 }}>
										<div style={{ fontWeight: 600 }}>{p.user?.displayName || p.user?.name || '—'}</div>
										<div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{p.flavor || '—'}</div>
									</td>
									<td style={{ padding: '12px 16px' }}>
										{p.uploadedImageUrl ? (
											<a href={p.uploadedImageUrl} target="_blank" rel="noopener noreferrer">
												<img src={p.uploadedImageUrl} alt="Uploaded" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '2px solid #e2e8f0' }} />
											</a>
										) : (
											<div style={{ width: 80, height: 80, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#94a3b8' }}>No image</div>
										)}
									</td>
									<td style={{ padding: '12px 16px' }}>
										{p.finalImageUrl ? (
											<a href={p.finalImageUrl} target="_blank" rel="noopener noreferrer">
												<img src={p.finalImageUrl} alt="Final" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '2px solid #e2e8f0' }} />
											</a>
										) : (
											<div style={{ width: 80, height: 80, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#94a3b8' }}>Pending</div>
										)}
									</td>
									<td style={{ padding: '12px 16px' }}>
										{approvalBadge(p.approvalStatus)}
										<div style={{ marginTop: 4 }}>
											{p.submitted
												? <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: '#dcfce7', color: '#166534' }}>Submitted</span>
												: p.generationStatus === 'completed'
													? <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: '#fef9c3', color: '#854d0e' }}>Not Submitted</span>
													: null
											}
										</div>
										{p.adminReminderSent && (
											<div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
												📣 Reminded {p.adminReminderSentAt ? new Date(p.adminReminderSentAt).toLocaleDateString() : ''}
											</div>
										)}
										{p.reminderLinkClicked && (
											<div style={{ marginTop: 3 }}>
												<span style={{ padding: '2px 7px', borderRadius: 12, fontSize: 10, fontWeight: 600, background: '#dbeafe', color: '#1e40af' }}>
													🔗 Link Clicked {p.reminderLinkClickedAt ? new Date(p.reminderLinkClickedAt).toLocaleDateString() : ''}
												</span>
											</div>
										)}
										<div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{new Date(p.createdAt).toLocaleDateString()}</div>
									</td>
									<td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 18, fontWeight: 700 }}>{p.postStat?.voteCount ?? 0}</td>
									<td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#7c3aed' }}>
										{p.rank ? `#${p.rank}` : '—'}
									</td>
									<td style={{ padding: '8px 12px' }}>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, width: 160 }}>
											<button
												onClick={() => openStages(p.postId)}
												disabled={loadingStages}
												style={{ padding: '5px 4px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600, gridColumn: '1 / -1' }}
											>
												🖼️ Stages
											</button>
											<button
												onClick={() => handleApproval(p.postId, 'approve')}
												disabled={approving === p.postId}
												style={{ padding: '5px 4px', background: p.approvalStatus === 'approved' ? '#166534' : '#dcfce7', color: p.approvalStatus === 'approved' ? '#fff' : '#166534', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
											>
												{approving === p.postId ? '…' : p.approvalStatus === 'approved' ? '✓ Undo' : '✓ Approve'}
											</button>
											<button
												onClick={() => handleApproval(p.postId, 'reject')}
												disabled={approving === p.postId}
												style={{ padding: '5px 4px', background: p.approvalStatus === 'rejected' ? '#991b1b' : '#fee2e2', color: p.approvalStatus === 'rejected' ? '#fff' : '#991b1b', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
											>
												{approving === p.postId ? '…' : p.approvalStatus === 'rejected' ? '✗ Undo' : '✗ Reject'}
											</button>
											<button onClick={() => openEdit(p)} style={{ padding: '5px 4px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>✏️ Edit</button>
											<button onClick={() => openRestart(p)} style={{ padding: '5px 4px', background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>🔄 Restart</button>
											<button
												onClick={() => handleSendReminder(p.postId)}
												disabled={reminding === p.postId}
												style={{ padding: '5px 4px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
											>
												{reminding === p.postId ? '…' : '📣 Remind'}
											</button>
											<button onClick={() => handleDelete(p.postId)} style={{ padding: '5px 4px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>🗑️ Delete</button>
										</div>
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

			{editModal && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
					<div style={{ background: '#fff', borderRadius: 8, padding: 28, width: 420 }}>
						<h2 style={{ margin: '0 0 20px' }}>Edit Post</h2>
						{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
						<div style={{ marginBottom: 16 }}>
							<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Flavor</label>
							<input value={editForm.flavor} onChange={e => setEditForm(f => ({ ...f, flavor: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box' }} />
						</div>
						<div style={{ marginBottom: 16 }}>
							<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Gender</label>
							<select value={editForm.gender} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6 }}>
								<option value="">— None —</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</select>
						</div>
						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
							<button onClick={() => setEditModal(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
							<button onClick={handleSave} disabled={saving} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
						</div>
					</div>
				</div>
			)}

			{restartModal && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
					<div style={{ background: '#fff', borderRadius: 8, padding: 28, width: 440 }}>
						<h2 style={{ margin: '0 0 6px' }}>🔄 Restart Workflow</h2>
						<p style={{ margin: '0 0 20px', color: '#64748b', fontSize: 13 }}>Post: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{restartModal.postId}</code></p>
						{error && <div style={{ color: '#dc2626', marginBottom: 12, fontSize: 13 }}>{error}</div>}
						<div style={{ marginBottom: 20 }}>
							<label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Restart from stage:</label>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
								{STAGE_OPTIONS.map(opt => (
									<label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: `2px solid ${restartStage === opt.value ? '#f59e0b' : '#e2e8f0'}`, borderRadius: 6, cursor: 'pointer', background: restartStage === opt.value ? '#fffbeb' : '#fff', fontSize: 14 }}>
										<input type="radio" name="restartStage" value={opt.value} checked={restartStage === opt.value} onChange={() => setRestartStage(opt.value)} style={{ accentColor: '#f59e0b' }} />
										{opt.label}
									</label>
								))}
							</div>
						</div>
						<div style={{ background: '#fef9c3', border: '1px solid #fcd34d', borderRadius: 6, padding: '10px 12px', marginBottom: 20, fontSize: 12, color: '#78350f' }}>
							⚠️ This will re-run all AI processing stages from the selected point. The post's existing images may be overwritten.
						</div>
						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
							<button onClick={() => { setRestartModal(null); setError(''); }} style={{ padding: '8px 18px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
							<button onClick={handleRestart} disabled={restarting} style={{ padding: '8px 18px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>{restarting ? 'Starting…' : '🔄 Restart'}</button>
						</div>
					</div>
				</div>
			)}

			{bulkReminderModal && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
					<div style={{ background: '#fff', borderRadius: 8, padding: 28, width: 500 }}>
						<h2 style={{ margin: '0 0 6px' }}>📣 Bulk Remind Unsubmitted</h2>
						<p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 13 }}>
							Sends a reminder to all users whose photo is generated but not yet submitted. Use <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>{'{name}'}</code> as a placeholder for the user's name.
						</p>
						{bulkResult && (
							<div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 6, background: bulkResult.failed === 0 ? '#dcfce7' : '#fef9c3', color: bulkResult.failed === 0 ? '#166534' : '#78350f', fontSize: 13, fontWeight: 600 }}>
								Done — Sent: {bulkResult.sent}, Failed: {bulkResult.failed}, Total: {bulkResult.total}
							</div>
						)}
						<label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Message</label>
						<textarea
							value={reminderMessage}
							onChange={e => setReminderMessage(e.target.value)}
							rows={7}
							style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
						/>
						<p style={{ margin: '6px 0 16px', fontSize: 11, color: '#94a3b8' }}>Leave blank to use the default message with each user's name.</p>
						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
							<button onClick={() => { setBulkReminderModal(false); setBulkResult(null); }} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Close</button>
							<button onClick={handleBulkRemind} disabled={bulkSending} style={{ padding: '8px 18px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>
								{bulkSending ? 'Sending…' : '📣 Send to All'}
							</button>
						</div>
					</div>
				</div>
			)}

			{votingAnnouncementModal && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
					<div style={{ background: '#fff', borderRadius: 8, padding: 28, width: 560 }}>
						<h2 style={{ margin: '0 0 6px' }}>🗳️ Voting Announcement</h2>
						<p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 13 }}>
							Sends the voting announcement to <strong>all applicants</strong>. Tries WhatsApp (with flyer image) first, then WhatsApp text, then SMS. Each message includes the user's current rank at the bottom.
						</p>
						{votingResult && (
							<div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 6, background: votingResult.failed === 0 ? '#dcfce7' : '#fef9c3', color: votingResult.failed === 0 ? '#166534' : '#78350f', fontSize: 13, fontWeight: 600 }}>
								Done — Sent: {votingResult.sent}, Failed: {votingResult.failed}, Total: {votingResult.total}
							</div>
						)}
						<label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>Flyer Image URL <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional — sent via WhatsApp)</span></label>
						<input
							type="url"
							value={votingFlyerUrl}
							onChange={e => setVotingFlyerUrl(e.target.value)}
							placeholder="https://example.com/voting-flyer.jpg"
							style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box', fontSize: 13, marginBottom: 4 }}
						/>
						<p style={{ margin: '4px 0 16px', fontSize: 11, color: '#94a3b8' }}>Leave blank to send text-only via WhatsApp / SMS fallback.</p>
						<div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '12px 14px', marginBottom: 16, fontSize: 12, color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
							{`Voting has officially started!

Go to the [ aiavuruduwithzellers.com ] website and share your created AI අවුරුදු කුමරා or අවුරුදු කුමරිය by clicking the share button.

Then, get as many votes as possible for your AI අවුරුදු කුමරා or අවුරුදු කුමරිය profile on the website.

You're one step closer to winning LKR 75,000! 💰👑

Voting closes on April 19th at 9:00 A.M.

(Minimum required votes to be eligible for the AI අවුරුදු කුමරා and කුමරිය contest is 1,000 votes.)

Your current rank: #[rank] ([gender]) with [votes] votes`}
						</div>
						<div style={{ background: '#fef9c3', border: '1px solid #fcd34d', borderRadius: 6, padding: '8px 12px', marginBottom: 20, fontSize: 12, color: '#78350f' }}>
							⚠️ This will send a message to <strong>every applicant</strong>. Make sure you're ready before confirming.
						</div>
						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
							<button onClick={() => { setVotingAnnouncementModal(false); setVotingResult(null); }} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Close</button>
							<button onClick={handleVotingAnnouncement} disabled={votingSending} style={{ padding: '8px 18px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>
								{votingSending ? 'Sending…' : '🗳️ Send to All Applicants'}
							</button>
						</div>
					</div>
				</div>
			)}

			{stagesModal && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, overflowY: 'auto' }} onClick={() => setStagesModal(null)}>
					<div style={{ background: '#fff', borderRadius: 12, padding: 32, maxWidth: 1200, width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
							<h2 style={{ margin: 0 }}>Processing Stages - Post {stagesModal.postId}</h2>
							<button onClick={() => setStagesModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>✕ Close</button>
						</div>

						{/* Reference Images */}
						{(stagesModal.uploadedImageUrl || stagesModal.referenceImageUrl) && (
							<div style={{ marginBottom: 32, background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)', borderRadius: 12, padding: 24, boxShadow: '0 8px 12px rgba(0,0,0,.2)' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
									<span style={{ fontSize: 32 }}>🎨</span>
									<div>
										<h3 style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,.2)' }}>REFERENCES SENT TO KLING AI</h3>
										<p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.95)', fontSize: 14, fontWeight: 600 }}>These are the images used for AI style transfer</p>
									</div>
								</div>
								<div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
									{stagesModal.uploadedImageUrl && (
										<div>
											<p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700 }}>📸 Image 1 — User Upload</p>
											<div style={{ background: '#fff', borderRadius: 8, padding: 12, display: 'inline-block', boxShadow: '0 4px 8px rgba(0,0,0,.2)' }}>
												<img src={stagesModal.uploadedImageUrl} alt="User Upload" style={{ maxWidth: 320, width: '100%', height: 'auto', borderRadius: 6, display: 'block', border: '3px solid #f59e0b' }} />
											</div>
											<div style={{ marginTop: 8 }}>
												<a href={stagesModal.uploadedImageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#fff', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 6 }}>🔗 Open Full Size</a>
											</div>
										</div>
									)}
									{stagesModal.referenceImageUrl && (
										<div>
											<p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700 }}>🖼️ Image 2 — Style Reference</p>
											<div style={{ background: '#fff', borderRadius: 8, padding: 12, display: 'inline-block', boxShadow: '0 4px 8px rgba(0,0,0,.2)' }}>
												<img src={stagesModal.referenceImageUrl} alt="Style Reference" style={{ maxWidth: 320, width: '100%', height: 'auto', borderRadius: 6, display: 'block', border: '3px solid #fff' }} />
											</div>
											<div style={{ marginTop: 8 }}>
												<a href={stagesModal.referenceImageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#fff', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 6 }}>🔗 Open Full Size</a>
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
							{stagesModal.stages.map((stage, idx) => {
								const isDynamic = stage.isDynamic || /^stage2_\d+_styled$/.test(stage.stage);
								const headerBg = isDynamic ? '#fef3c7' : '#e0e7ff';
								const headerBorder = isDynamic ? '#fde68a' : '#c7d2fe';
								const labelColor = isDynamic ? '#92400e' : '#4338ca';
								const textColor = isDynamic ? '#78350f' : '#1e293b';
								return (
									<div key={stage.stage} style={{ background: '#f8fafc', borderRadius: 8, overflow: 'hidden', border: `1px solid ${isDynamic ? '#fde68a' : '#e2e8f0'}` }}>
										<div style={{ padding: 12, background: headerBg, borderBottom: `1px solid ${headerBorder}` }}>
											<div style={{ fontSize: 11, fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
												{isDynamic ? '⛓ Dynamic' : `Stage ${idx + 1}`}
											</div>
											<div style={{ fontSize: 14, fontWeight: 600, color: textColor, marginTop: 2 }}>{stage.label}</div>
										</div>
										<div style={{ padding: 12 }}>
											<img src={stage.url} alt={stage.label} style={{ width: '100%', height: 'auto', borderRadius: 6, display: 'block', marginBottom: 8 }} />
											<a href={stage.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>🔗 Open Full Size</a>
										</div>
									</div>
								);
							})}
						</div>
						{stagesModal.stages.length === 0 && (
							<div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
								<p>No stage images found for this post.</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
