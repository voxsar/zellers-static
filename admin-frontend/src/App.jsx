import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import WorkflowsPage from './pages/WorkflowsPage';
import WorkflowDetailPage from './pages/WorkflowDetailPage';
import PromptsPage from './pages/PromptsPage';
import DynamicPromptsPage from './pages/DynamicPromptsPage';
import { ChocoImagesPage, PlacesPage, ReferenceImagesPage, FrameOverlaysPage } from './pages/ImagePages';
import VotesPage from './pages/VotesPage';
import PostsPage from './pages/PostsPage';
import QueuePage from './pages/QueuePage';

function ProtectedRoute({ children }) {
	const token = localStorage.getItem('adminToken');
	if (!token) return <Navigate to="/login" replace />;
	return children;
}

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Layout />
						</ProtectedRoute>
					}
				>
					<Route index element={<Navigate to="/dashboard" replace />} />
					<Route path="dashboard" element={<DashboardPage />} />
					<Route path="users" element={<UsersPage />} />
					<Route path="workflows" element={<WorkflowsPage />} />
					<Route path="workflows/:userId" element={<WorkflowDetailPage />} />
					<Route path="prompts" element={<PromptsPage />} />
					<Route path="dynamic-prompts" element={<DynamicPromptsPage />} />
					<Route path="choco-images" element={<ChocoImagesPage />} />
					<Route path="places" element={<PlacesPage />} />
					<Route path="reference-images" element={<ReferenceImagesPage />} />
					<Route path="frame-overlays" element={<FrameOverlaysPage />} />
					<Route path="votes" element={<VotesPage />} />
					<Route path="posts" element={<PostsPage />} />
					<Route path="queue" element={<QueuePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
