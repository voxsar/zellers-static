import { useState, useEffect } from 'react';
import api from '../api';

const emptyForm = { name: '', description: '', active: true, steps: [] };

export default function DynamicPromptsPage() {
	const [chains, setChains] = useState([]);
	const [prompts, setPrompts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [modal, setModal] = useState(null); // null | 'create' | chain object for edit
	const [form, setForm] = useState(emptyForm);
	const [saving, setSaving] = useState(false);

	const load = async () => {
		setLoading(true);
		setError('');
		try {
			const [chainsRes, promptsRes] = await Promise.all([
				api.get('/dynamic-prompt-chains'),
				api.get('/prompts'),
			]);
			setChains(chainsRes.data.chains || []);
			setPrompts(promptsRes.data.prompts || []);
		} catch {
			setError('Failed to load data');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { load(); }, []);

	const openCreate = () => {
		setForm(emptyForm);
		setError('');
		setModal('create');
	};

	const openEdit = (chain) => {
		setForm({
			name: chain.name || '',
			description: chain.description || '',
			active: chain.active !== false,
			steps: (chain.steps || [])
				.slice()
				.sort((a, b) => a.order - b.order)
				.map(s => ({
					order: s.order,
					promptId: (s.promptId?._id || s.promptId || ''),
				})),
		});
		setError('');
		setModal(chain);
	};

	const handleSave = async () => {
		if (!form.name.trim()) { setError('Name is required'); return; }
		setSaving(true);
		setError('');
		// Normalise step orders to 1-based sequential
		const steps = form.steps.map((s, i) => ({ order: i + 1, promptId: s.promptId }));
		const payload = { name: form.name.trim(), description: form.description, active: form.active, steps };
		try {
			if (modal === 'create') {
				await api.post('/dynamic-prompt-chains', payload);
			} else {
				await api.put(`/dynamic-prompt-chains/${modal._id}`, payload);
			}
			setModal(null);
			load();
		} catch (e) {
			setError(e?.response?.data?.message || 'Save failed');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Delete this chain? It will be detached from all prompts.')) return;
		try {
			await api.delete(`/dynamic-prompt-chains/${id}`);
			load();
		} catch {
			setError('Delete failed');
		}
	};

	// ─── Step editing helpers ───────────────────────────────────────────────

	const addStep = () => {
		setForm(f => ({
			...f,
			steps: [...f.steps, { order: f.steps.length + 1, promptId: '' }],
		}));
	};

	const removeStep = (idx) => {
		setForm(f => ({ ...f, steps: f.steps.filter((_, i) => i !== idx) }));
	};

	const moveStep = (idx, dir) => {
		setForm(f => {
			const steps = [...f.steps];
			const target = idx + dir;
			if (target < 0 || target >= steps.length) return f;
			[steps[idx], steps[target]] = [steps[target], steps[idx]];
			return { ...f, steps };
		});
	};

	const updateStepPrompt = (idx, promptId) => {
		setForm(f => {
			const steps = [...f.steps];
			steps[idx] = { ...steps[idx], promptId };
			return { ...f, steps };
		});
	};

	// ─── Prompt display helper ──────────────────────────────────────────────

	const promptLabel = (p) =>
		`${p.name} [${p.stage}${p.gender ? ':' + p.gender : ''}${p.flavour ? ':' + p.flavour : ''}]`;

	const promptById = (id) => prompts.find(p => (p._id || p) === id);

	// ─── Render ─────────────────────────────────────────────────────────────

	return (
		<div>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
				<h1 style={{ margin: 0 }}>Dynamic Prompt Chains</h1>
				<button
					onClick={openCreate}
					style={{ padding: '8px 18px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
				>
					+ New Chain
				</button>
			</div>

			<p style={{ color: '#64748b', marginTop: 0, marginBottom: 20, fontSize: 13 }}>
				Chains are optional sequences of Kling Omni steps that run between Stage 2 (Style Transfer) and Stage 3 (Face Swap).
				Attach a chain to a <em>fantasy_style</em> prompt to activate it.
			</p>

			{error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}
			{loading ? <p>Loading…</p> : (
				<>
					{chains.length === 0 && (
						<div style={{ padding: 40, textAlign: 'center', background: '#f8fafc', borderRadius: 8, color: '#94a3b8', border: '1px dashed #e2e8f0' }}>
							No chains yet. Create one to start building dynamic pipelines.
						</div>
					)}
					{chains.length > 0 && (
						<table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.1)' }}>
							<thead style={{ background: '#f8fafc' }}>
								<tr>
									{['Name', 'Steps', 'Active', 'Description', 'Actions'].map(h => (
										<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{chains.map(chain => (
									<tr key={chain._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
										<td style={{ padding: '12px 16px', fontWeight: 600 }}>{chain.name}</td>
										<td style={{ padding: '12px 16px' }}>
											<span style={{ background: '#ede9fe', color: '#5b21b6', padding: '3px 10px', borderRadius: 12, fontWeight: 700, fontSize: 13 }}>
												{(chain.steps || []).length}
											</span>
											{(chain.steps || []).length > 0 && (
												<div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
													{[...chain.steps].sort((a, b) => a.order - b.order).map((s, i) => (
														<div key={i} style={{ fontSize: 11, color: '#64748b' }}>
															{i + 1}. {s.promptId?.name || s.promptId || '–'}
														</div>
													))}
												</div>
											)}
										</td>
										<td style={{ padding: '12px 16px' }}>
											<span style={{
												padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600,
												background: chain.active ? '#dcfce7' : '#f1f5f9',
												color: chain.active ? '#166534' : '#94a3b8',
											}}>
												{chain.active ? 'Active' : 'Inactive'}
											</span>
										</td>
										<td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', maxWidth: 250 }}>
											{chain.description || '—'}
										</td>
										<td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
											<button onClick={() => openEdit(chain)} style={{ padding: '5px 12px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginRight: 6 }}>
												✏️ Edit
											</button>
											<button onClick={() => handleDelete(chain._id)} style={{ padding: '5px 12px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
												🗑️ Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</>
			)}

			{/* ── Create / Edit Modal ──────────────────────────────────────── */}
			{modal && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '40px 16px' }}>
					<div style={{ background: '#fff', borderRadius: 10, padding: 32, width: '100%', maxWidth: 600, position: 'relative' }}>
						<h2 style={{ margin: '0 0 20px' }}>{modal === 'create' ? 'New Chain' : `Edit "${modal.name}"`}</h2>
						{error && <div style={{ color: '#dc2626', marginBottom: 12, fontSize: 13 }}>{error}</div>}

						<div style={{ marginBottom: 16 }}>
							<label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Name *</label>
							<input
								value={form.name}
								onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
								style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box', fontSize: 14 }}
								placeholder="e.g. Fantasy Enhancement Chain"
							/>
						</div>

						<div style={{ marginBottom: 16 }}>
							<label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Description</label>
							<input
								value={form.description}
								onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
								style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box', fontSize: 14 }}
								placeholder="Optional description"
							/>
						</div>

						<div style={{ marginBottom: 20 }}>
							<label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
								<input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
								Active
							</label>
						</div>

						{/* ── Steps Builder ──────────────────────────────────────── */}
						<div style={{ marginBottom: 20 }}>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
								<label style={{ fontWeight: 600, fontSize: 14 }}>Steps (ordered)</label>
								<button
									onClick={addStep}
									style={{ padding: '5px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
								>
									+ Add Step
								</button>
							</div>

							{form.steps.length === 0 && (
								<div style={{ padding: 20, background: '#f8fafc', borderRadius: 6, textAlign: 'center', color: '#94a3b8', fontSize: 13, border: '1px dashed #e2e8f0' }}>
									No steps yet. Add a step to build the pipeline.
								</div>
							)}

							{form.steps.map((step, idx) => (
								<div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, background: '#f8fafc', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
									<span style={{ fontWeight: 700, color: '#6366f1', fontSize: 14, minWidth: 24 }}>{idx + 1}</span>
									<select
										value={step.promptId}
										onChange={e => updateStepPrompt(idx, e.target.value)}
										style={{ flex: 1, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13 }}
									>
										<option value="">— Select a prompt —</option>
										{prompts.map(p => (
											<option key={p._id} value={p._id}>{promptLabel(p)}</option>
										))}
									</select>
									<button
										onClick={() => moveStep(idx, -1)}
										disabled={idx === 0}
										title="Move up"
										style={{ padding: '4px 8px', background: idx === 0 ? '#f1f5f9' : '#e0e7ff', border: 'none', borderRadius: 4, cursor: idx === 0 ? 'default' : 'pointer', fontSize: 12, opacity: idx === 0 ? 0.4 : 1 }}
									>↑</button>
									<button
										onClick={() => moveStep(idx, 1)}
										disabled={idx === form.steps.length - 1}
										title="Move down"
										style={{ padding: '4px 8px', background: idx === form.steps.length - 1 ? '#f1f5f9' : '#e0e7ff', border: 'none', borderRadius: 4, cursor: idx === form.steps.length - 1 ? 'default' : 'pointer', fontSize: 12, opacity: idx === form.steps.length - 1 ? 0.4 : 1 }}
									>↓</button>
									<button
										onClick={() => removeStep(idx)}
										title="Remove step"
										style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
									>✕</button>
								</div>
							))}

							{form.steps.length > 0 && (
								<p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
									Each step sends the previous output + its prompt's reference image to Kling Omni.
									Step {form.steps.length} output feeds into Stage 3 (Face Swap).
								</p>
							)}
						</div>

						<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
							<button
								onClick={() => setModal(null)}
								style={{ padding: '8px 18px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								disabled={saving}
								style={{ padding: '8px 18px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
							>
								{saving ? 'Saving…' : 'Save Chain'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
