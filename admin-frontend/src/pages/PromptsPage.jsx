import { useState, useEffect } from 'react';
import api from '../api';

const STAGE_ORDER = ['otp_verify', 'profile_setup', 'quiz_submit', 'photo_upload', 'bg_removal', 'image_composite', 'fantasy_style', 'face_swap', 'bg_removal_gen', 'branded_composites'];
const FLAVOUR_OPTIONS = ['', 'pista', 'cookie_cream', 'mixed_nut', 'red', 'strawberry', 'coconut', 'coconut_cream'];
const GENDER_OPTIONS = ['', 'male', 'female'];

const emptyForm = { name: '', stage: 'fantasy_style', text: '', description: '', active: true, gender: '', flavour: '', dynamicChain: '' };

export default function PromptsPage() {
	const [prompts, setPrompts] = useState([]);
	const [chains, setChains] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modal, setModal] = useState(null); // null | 'create' | 'edit'
	const [form, setForm] = useState(emptyForm);
	const [editId, setEditId] = useState(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	const load = async () => {
		try {
			setLoading(true);
			const [promptsRes, chainsRes] = await Promise.all([
				api.get('/prompts'),
				api.get('/dynamic-prompt-chains'),
			]);
			setPrompts(promptsRes.data.prompts || []);
			setChains(chainsRes.data.chains || []);
		} catch { setError('Failed to load prompts'); }
		finally { setLoading(false); }
	};

	useEffect(() => { load(); }, []);

	const openCreate = () => { setForm(emptyForm); setEditId(null); setModal('create'); };
	const openEdit = (p) => { setForm({ name: p.name, stage: p.stage, text: p.text, description: p.description || '', active: p.active, gender: p.gender || '', flavour: p.flavour || '', dynamicChain: p.dynamicChain?._id || p.dynamicChain || '' }); setEditId(p._id); setModal('edit'); };

	const handleSave = async () => {
		if (!form.name || !form.text) return setError('Name and text are required.');
		setSaving(true);
		try {
			if (modal === 'create') await api.post('/prompts', form);
			else await api.put(`/prompts/${editId}`, form);
			setModal(null);
			setError('');
			load();
		} catch { setError('Save failed'); }
		finally { setSaving(false); }
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Delete this prompt?')) return;
		try { await api.delete(`/prompts/${id}`); load(); } catch { setError('Delete failed'); }
	};

	const badge = (active) => (
		<span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, background: active ? '#dcfce7' : '#fee2e2', color: active ? '#166534' : '#991b1b' }}>
			{active ? 'Active' : 'Inactive'}
		</span>
	);

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
				<h1 style={{ margin: 0 }}>Prompts</h1>
				<button onClick={openCreate} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>+ New Prompt</button>
			</div>
			{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
			{loading ? <p>Loading…</p> : (
				<table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.1)' }}>
					<thead style={{ background: '#f8fafc' }}>
						<tr>{['Name', 'Stage', 'Gender', 'Flavour', 'Active', 'Ref Images', 'Dynamic Chain', 'Description', 'Actions'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>)}</tr>
					</thead>
					<tbody>
						{prompts.map(p => (
							<tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
								<td style={{ padding: '12px 16px', fontWeight: 500 }}>{p.name}</td>
								<td style={{ padding: '12px 16px', fontSize: 13 }}>{p.stage}</td>
								<td style={{ padding: '12px 16px', fontSize: 13 }}>{p.gender || '—'}</td>
								<td style={{ padding: '12px 16px', fontSize: 13 }}>{p.flavour || '—'}</td>
								<td style={{ padding: '12px 16px' }}>{badge(p.active)}</td>
								<td style={{ padding: '12px 16px', fontSize: 13 }}>
									{p.referenceImages && p.referenceImages.length > 0
										? p.referenceImages.map(r => r.name || r._id).join(', ')
										: <span style={{ color: '#94a3b8' }}>None</span>}
								</td>
								<td style={{ padding: '12px 16px', fontSize: 13 }}>
									{p.dynamicChain
										? <span style={{ background: '#ede9fe', color: '#5b21b6', padding: '2px 8px', borderRadius: 10, fontWeight: 600, fontSize: 12 }}>{p.dynamicChain?.name || '—'}</span>
										: <span style={{ color: '#94a3b8' }}>—</span>}
								</td>
								<td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description || '—'}</td>
								<td style={{ padding: '12px 16px' }}>
									<button onClick={() => openEdit(p)} style={{ marginRight: 8, padding: '4px 12px', background: '#f1f5f9', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Edit</button>
									<button onClick={() => handleDelete(p._id)} style={{ padding: '4px 12px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			{modal && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
					<div style={{ background: '#fff', borderRadius: 8, padding: 28, width: 520, maxHeight: '90vh', overflowY: 'auto' }}>
						<h2 style={{ margin: '0 0 20px' }}>{modal === 'create' ? 'New Prompt' : 'Edit Prompt'}</h2>
						{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
						{[['name', 'Name', 'text'], ['description', 'Description', 'text']].map(([key, label, type]) => (
							<div key={key} style={{ marginBottom: 16 }}>
								<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>{label}</label>
								<input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box' }} />
							</div>
						))}
						<div style={{ marginBottom: 16 }}>
							<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Stage</label>
							<select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6 }}>
								{STAGE_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
							</select>
						</div>
						<div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
							<div style={{ flex: 1 }}>
								<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Gender</label>
								<select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6 }}>
									{GENDER_OPTIONS.map(g => <option key={g} value={g}>{g || '— Any —'}</option>)}
								</select>
							</div>
							<div style={{ flex: 1 }}>
								<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Flavour</label>
								<select value={form.flavour} onChange={e => setForm(f => ({ ...f, flavour: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6 }}>
									{FLAVOUR_OPTIONS.map(f => <option key={f} value={f}>{f || '— Any —'}</option>)}
								</select>
							</div>
						</div>
						<div style={{ marginBottom: 16 }}>
							<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Text *</label>
							<textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={5} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box', resize: 'vertical' }} />
						</div>
						<div style={{ marginBottom: 20 }}>
							<label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
								<input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
								Active
							</label>
						</div>
						{form.stage === 'fantasy_style' && (
							<div style={{ marginBottom: 16 }}>
								<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
									Dynamic Chain <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 12 }}>(optional — runs between Stage 2 and Stage 3)</span>
								</label>
								<select
									value={form.dynamicChain}
									onChange={e => setForm(f => ({ ...f, dynamicChain: e.target.value }))}
									style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6 }}
								>
									<option value="">— None (skip dynamic chain) —</option>
									{chains.filter(c => c.active).map(c => (
										<option key={c._id} value={c._id}>{c.name} ({(c.steps || []).length} step{(c.steps || []).length !== 1 ? 's' : ''})</option>
									))}
								</select>
							</div>
						)}
						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
							<button onClick={() => { setModal(null); setError(''); }} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
							<button onClick={handleSave} disabled={saving} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
