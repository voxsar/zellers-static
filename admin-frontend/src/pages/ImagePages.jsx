import { useState, useEffect, useRef } from 'react';
import api from '../api';

// Valid chocolate flavors for overlays (keep in sync with PromptsPage)
const FLAVOUR_OPTIONS = [
	'',
	'pista',
	'cookie_cream',
	'mixed_nut',
	'red',
	'strawberry',
	'coconut',
	'coconut_cream',
];

function ImageCRUDPage({ title, endpoint, extraFields = [], extraFormFields = [] }) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'replace'
	const [selected, setSelected] = useState(null);
	const [form, setForm] = useState({});
	const [file, setFile] = useState(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const fileRef = useRef();

	const load = async () => {
		try {
			setLoading(true);
			const { data } = await api.get(`/${endpoint}`);
			const key = Object.keys(data).find(k => Array.isArray(data[k]));
			setItems(data[key] || []);
		} catch { setError('Failed to load'); }
		finally { setLoading(false); }
	};

	useEffect(() => { load(); }, []);

	const openCreate = () => { setForm({}); setFile(null); setSelected(null); setModal('create'); setError(''); };
	const openEdit = (item) => {
		setSelected(item);
		// Populate form from both extraFields and extraFormFields
		const allKeys = [...extraFields, ...extraFormFields];
		const uniqueKeys = [...new Map(allKeys.map(f => [f.key, f])).values()];
		const formData = Object.fromEntries(uniqueKeys.map(f => {
			const val = item[f.key];
			// Handle array of populated ObjectId refs (multiselect)
			if (Array.isArray(val)) return [f.key, val.map(v => (v && typeof v === 'object' && v._id) ? v._id : v).filter(Boolean)];
			// Handle single populated ObjectId ref (e.g. promptId: { _id, name })
			if (val && typeof val === 'object' && val._id) return [f.key, val._id];
			return [f.key, val ?? ''];
		}));
		setForm(formData);
		setModal('edit');
		setError('');
	};
	const openReplace = (item) => { setSelected(item); setFile(null); setModal('replace'); setError(''); };

	const handleSave = async () => {
		setSaving(true);
		setError('');
		try {
			if (modal === 'create') {
				if (!file) return setError('Image file is required.');
				const fd = new FormData();
				fd.append('image', file);
				Object.entries(form).forEach(([k, v]) => {
					if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
					else fd.append(k, v);
				});
				await api.post(`/${endpoint}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
			} else if (modal === 'edit') {
				await api.put(`/${endpoint}/${selected._id}`, form);
			} else if (modal === 'replace') {
				if (!file) return setError('Image file is required.');
				const fd = new FormData();
				fd.append('image', file);
				await api.post(`/${endpoint}/${selected._id}/replace`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
			}
			setModal(null);
			load();
		} catch (e) { setError(e?.response?.data?.message || 'Save failed'); }
		finally { setSaving(false); }
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Delete this item?')) return;
		try { await api.delete(`/${endpoint}/${id}`); load(); } catch { setError('Delete failed'); }
	};

	const badge = (active) => (
		<span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, background: active ? '#dcfce7' : '#fee2e2', color: active ? '#166534' : '#991b1b' }}>
			{active ? 'Active' : 'Inactive'}
		</span>
	);

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
				<h1 style={{ margin: 0 }}>{title}</h1>
				<button onClick={openCreate} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>+ New</button>
			</div>
			{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
			{loading ? <p>Loading…</p> : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
					{items.map(item => (
						<div key={item._id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,.1)', overflow: 'hidden' }}>
							{item.url ? (
								<img src={item.url} alt={item.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
							) : (
								<div style={{ width: '100%', height: 140, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No image</div>
							)}
							<div style={{ padding: 12 }}>
								<div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
								{extraFields.filter(f => f.key !== 'active').map(f => (
									<div key={f.key} style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>{f.label}: {f.render ? f.render(item) : (item[f.key] || '—')}</div>
								))}
								<div style={{ marginTop: 6 }}>{badge(item.active)}</div>
								<div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
									<button onClick={() => openEdit(item)} style={{ flex: 1, padding: '4px 8px', background: '#f1f5f9', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Edit</button>
									<button onClick={() => openReplace(item)} style={{ flex: 1, padding: '4px 8px', background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Replace</button>
									<button onClick={() => handleDelete(item._id)} style={{ flex: 1, padding: '4px 8px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Delete</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{modal && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
					<div style={{ background: '#fff', borderRadius: 8, padding: 28, width: 440, maxHeight: '90vh', overflowY: 'auto' }}>
						<h2 style={{ margin: '0 0 20px' }}>
							{modal === 'create' ? 'New' : modal === 'edit' ? 'Edit' : 'Replace Image'} {title.replace(/s$/, '')}
						</h2>
						{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

						{(modal === 'create' || modal === 'replace') && (
							<div style={{ marginBottom: 16 }}>
								<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Image File *</label>
								<input ref={fileRef} type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={{ width: '100%' }} />
							</div>
						)}

						{modal !== 'replace' && (
							<>
								<div style={{ marginBottom: 16 }}>
									<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>Name *</label>
									<input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box' }} />
								</div>
								{extraFormFields.map(({ key, label, type, options }) => (
									<div key={key} style={{ marginBottom: 16 }}>
										<label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>{label}</label>
										{type === 'select' ? (
											<select value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6 }}>
												<option value="">— None —</option>
												{(options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
											</select>
										) : type === 'multiselect' ? (() => {
											const sel = Array.isArray(form[key]) ? form[key].map(String) : (form[key] ? [String(form[key])] : []);
											return (
												<div style={{ border: '1px solid #e2e8f0', borderRadius: 6, maxHeight: 180, overflowY: 'auto', padding: 4 }}>
													{(options || []).length === 0 && <div style={{ padding: '6px 8px', color: '#94a3b8', fontSize: 13 }}>No options</div>}
													{(options || []).map(o => (
														<label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', cursor: 'pointer', borderRadius: 4, background: sel.includes(String(o.value)) ? '#eff6ff' : 'transparent' }}>
															<input
																type="checkbox"
																checked={sel.includes(String(o.value))}
																onChange={e => {
																	const next = e.target.checked
																		? [...sel, String(o.value)]
																		: sel.filter(id => id !== String(o.value));
																	setForm(f => ({ ...f, [key]: next }));
																}}
															/>
															<span style={{ fontSize: 13 }}>{o.label}</span>
														</label>
													))}
												</div>
											);
										})() : type === 'checkbox' ? (
											<label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
												<input type="checkbox" checked={!!form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
												{label}
											</label>
										) : (
											<input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box' }} />
										)}
									</div>
								))}
								{modal === 'edit' && (
									<div style={{ marginBottom: 16 }}>
										<label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
											<input type="checkbox" checked={!!form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
											Active
										</label>
									</div>
								)}
							</>
						)}

						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
							<button onClick={() => { setModal(null); setError(''); }} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
							<button onClick={handleSave} disabled={saving} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export function ChocoImagesPage() {
	return (
		<ImageCRUDPage
			title="Choco Images"
			endpoint="choco-images"
			extraFields={[{ key: 'flavor', label: 'Flavor' }, { key: 'description', label: 'Description' }]}
			extraFormFields={[
				{ key: 'flavor', label: 'Flavor', type: 'text' },
				{ key: 'description', label: 'Description', type: 'text' },
			]}
		/>
	);
}

export function PlacesPage() {
	return (
		<ImageCRUDPage
			title="Places"
			endpoint="places"
			extraFields={[{ key: 'description', label: 'Description' }]}
			extraFormFields={[
				{ key: 'description', label: 'Description', type: 'text' },
			]}
		/>
	);
}

export function ReferenceImagesPage() {
	const [prompts, setPrompts] = useState([]);
	useEffect(() => {
		api.get('/prompts').then(({ data }) => setPrompts(data.prompts || [])).catch(() => { });
	}, []);

	return (
		<ImageCRUDPage
			title="Reference Images"
			endpoint="reference-images"
			extraFields={[
				{ key: 'description', label: 'Description' },
				{ key: 'promptIds', label: 'Associated Prompts', render: (item) => (item.promptIds && item.promptIds.length > 0) ? item.promptIds.map(p => `${p.name} (${p.stage})`).join(', ') : '—' },
			]}
			extraFormFields={[
				{ key: 'description', label: 'Description', type: 'text' },
				{
					key: 'promptIds', label: 'Associated Prompts', type: 'multiselect',
					options: prompts.map(p => ({ value: p._id, label: `${p.name} (${p.stage})` })),
				},
			]}
		/>
	);
}

export function FrameOverlaysPage() {
	return (
		<ImageCRUDPage
			title="Frame Overlays"
			endpoint="frame-overlays"
			extraFields={[{ key: 'flavor', label: 'Flavor' }, { key: 'description', label: 'Description' }]}
			extraFormFields={[
				{ key: 'flavor', label: 'Flavor', type: 'select', options: FLAVOUR_OPTIONS.filter(f => f).map(f => ({ value: f, label: f })) },
				{ key: 'description', label: 'Description', type: 'text' },
			]}
		/>
	);
}
