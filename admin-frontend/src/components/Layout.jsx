import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout() {
	const navigate = useNavigate();
	let adminUser = null;
	try {
		adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
	} catch { }

	const handleLogout = () => {
		localStorage.removeItem('adminToken');
		localStorage.removeItem('adminUser');
		navigate('/login');
	};

	const navLinks = [
		{ to: '/dashboard', label: 'Dashboard' },
		{ to: '/users', label: 'Users' },
		{ to: '/workflows', label: 'Workflows' },
		{ to: '/prompts', label: 'Prompts' },
		{ to: '/dynamic-prompts', label: 'Dynamic Prompts' },
		{ to: '/choco-images', label: 'Choco Images' },
		{ to: '/places', label: 'Places' },
		{ to: '/reference-images', label: 'Reference Images' },
		{ to: '/frame-overlays', label: 'Frame Overlays' },
		{ to: '/votes', label: 'Votes' },
		{ to: '/posts', label: 'Posts' },
		{ to: '/queue', label: 'Queue' },
	];

	return (
		<div className="layout">
			<aside className="sidebar">
				<h2>Zellers Admin</h2>
				{adminUser && (
					<div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: 16, padding: '6px 12px', background: '#334155', borderRadius: 6 }}>
						{adminUser.username || adminUser.email || 'Admin'}
					</div>
				)}
				<nav>
					{navLinks.map(({ to, label }) => (
						<NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>
							{label}
						</NavLink>
					))}
				</nav>
				<button className="logout-btn" onClick={handleLogout} style={{ marginTop: 24 }}>
					Logout
				</button>
			</aside>
			<main className="main-content">
				<Outlet />
			</main>
		</div>
	);
}
