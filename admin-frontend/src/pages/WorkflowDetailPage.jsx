import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import api from '../api';

const STAGE_ORDER = ['otp_verify', 'profile_setup', 'quiz_submit', 'photo_upload', 'fantasy_style', 'face_swap', 'bg_removal_gen', 'branded_composites'];

const statusColors = {
	completed: { background: '#dcfce7', color: '#166534', border: '2px solid #16a34a' },
	failed: { background: '#fee2e2', color: '#991b1b', border: '2px solid #ef4444' },
	skipped: { background: '#fef9c3', color: '#854d0e', border: '2px solid #ca8a04' },
	pending: { background: '#f1f5f9', color: '#475569', border: '2px solid #94a3b8' },
};

function WorkflowStageNode({ data }) {
	const colors = statusColors[data.status] || statusColors.pending;
	return (
		<div style={{
			...colors,
			padding: '12px 16px',
			borderRadius: 8,
			minWidth: 160,
			fontSize: '0.8rem',
			background: colors.background,
		}}>
			{data.isCurrent && (
				<div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>● CURRENT</div>
			)}
			<div style={{ fontWeight: 700, marginBottom: 4 }}>{data.label}</div>
			<div style={{ color: colors.color, fontWeight: 600 }}>{data.status?.toUpperCase()}</div>
			{data.completedAt && (
				<div style={{ fontSize: '0.7rem', marginTop: 4, opacity: 0.7 }}>
					{new Date(data.completedAt).toLocaleString()}
				</div>
			)}
		</div>
	);
}

const nodeTypes = { workflowStage: WorkflowStageNode };

export default function WorkflowDetailPage() {
	const { userId } = useParams();
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedNode, setSelectedNode] = useState(null);
	const [stageStatus, setStageStatus] = useState('');
	const [stagePrompt, setStagePrompt] = useState('');
	const [retriggerStage, setRetriggerStage] = useState(STAGE_ORDER[0]);
	const [retriggerPrompt, setRetriggerPrompt] = useState('');
	const [saving, setSaving] = useState(false);
	const [retriggering, setRetriggering] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const loadWorkflow = useCallback(() => {
		api.get(`/workflows/${userId}`).then((r) => {
			const flow = r.data.flow;
			if (flow?.nodes) setNodes(flow.nodes);
			if (flow?.edges) setEdges(flow.edges);
		}).catch(() => setError('Failed to load workflow'));
	}, [userId]);

	useEffect(() => { loadWorkflow(); }, [loadWorkflow]);

	const onNodeClick = useCallback((_, node) => {
		setSelectedNode(node);
		setStageStatus(node.data.status || 'pending');
		setStagePrompt(node.data.promptOverride || '');
	}, []);

	const handleSaveStage = async () => {
		if (!selectedNode) return;
		setSaving(true);
		setError(''); setSuccess('');
		try {
			await api.put(`/workflows/${userId}/stage/${selectedNode.id}`, {
				status: stageStatus,
				promptOverride: stagePrompt || undefined,
			});
			setSuccess('Stage updated');
			loadWorkflow();
		} catch (e) {
			setError(e.response?.data?.message || 'Update failed');
		} finally {
			setSaving(false);
		}
	};

	const handleRetrigger = async () => {
		setRetriggering(true);
		setError(''); setSuccess('');
		try {
			await api.post(`/workflows/${userId}/retrigger`, {
				fromStage: retriggerStage,
				promptOverride: retriggerPrompt || undefined,
			});
			setSuccess('Retriggered');
			loadWorkflow();
		} catch (e) {
			setError(e.response?.data?.message || 'Retrigger failed');
		} finally {
			setRetriggering(false);
		}
	};

	return (
		<div>
			<div className="page-header">
				<h1>Workflow Detail</h1>
			</div>
			{error && <div className="error-msg">{error}</div>}
			{success && <div style={{ background: '#dcfce7', color: '#166534', padding: '8px 12px', borderRadius: 6, marginBottom: 12 }}>{success}</div>}
			<div className="card" style={{ marginBottom: 16 }}>
				<div style={{ height: 400 }}>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onNodeClick={onNodeClick}
						nodeTypes={nodeTypes}
						fitView
						defaultEdgeOptions={{
							type: 'smoothstep',
							markerEnd: { type: 'arrowclosed' },
							style: { strokeWidth: 2 },
						}}
					>
						<Background />
						<Controls />
						<MiniMap />
					</ReactFlow>
				</div>
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
				<div className="card">
					<h3 style={{ marginBottom: 16 }}>Update Stage {selectedNode ? `- ${selectedNode.id}` : '(click a node)'}</h3>
					{selectedNode ? (
						<>
							<div className="form-group">
								<label>Status</label>
								<select value={stageStatus} onChange={(e) => setStageStatus(e.target.value)}>
									{['pending', 'completed', 'failed', 'skipped'].map((s) => (
										<option key={s} value={s}>{s}</option>
									))}
								</select>
							</div>
							<div className="form-group">
								<label>Prompt Override</label>
								<textarea value={stagePrompt} onChange={(e) => setStagePrompt(e.target.value)} rows={3} />
							</div>
							<button className="btn btn-primary" onClick={handleSaveStage} disabled={saving}>
								{saving ? 'Saving...' : 'Save'}
							</button>
						</>
					) : <p style={{ color: '#94a3b8' }}>Select a node in the flow diagram</p>}
				</div>
				<div className="card">
					<h3 style={{ marginBottom: 16 }}>Retrigger Workflow</h3>
					<div className="form-group">
						<label>From Stage</label>
						<select value={retriggerStage} onChange={(e) => setRetriggerStage(e.target.value)}>
							{STAGE_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
						</select>
					</div>
					<div className="form-group">
						<label>Prompt Override</label>
						<textarea value={retriggerPrompt} onChange={(e) => setRetriggerPrompt(e.target.value)} rows={3} />
					</div>
					<button className="btn btn-primary" onClick={handleRetrigger} disabled={retriggering}>
						{retriggering ? 'Retriggering...' : 'Retrigger'}
					</button>
				</div>
			</div>
		</div>
	);
}
