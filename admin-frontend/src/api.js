/**
 * Static archive API adapter.
 * Replaces axios HTTP calls with local JSON file reads.
 * All mutating operations are read-only no-ops.
 */

const DATA_BASE = '/data';
const cache = {};

async function load(file) {
  if (cache[file]) return cache[file];
  const res = await fetch(`${DATA_BASE}/${file}`);
  if (!res.ok) throw new Error(`Failed to load ${file}`);
  cache[file] = await res.json();
  return cache[file];
}

function paginate(arr, page, limit) {
  const total = arr.length;
  if (!limit || limit === 'all') {
    return { data: arr, pagination: { page: 1, totalPages: 1, total, limit: total } };
  }
  const start = (page - 1) * limit;
  return {
    data: arr.slice(start, start + limit),
    pagination: { page, totalPages: Math.ceil(total / limit), total, limit },
  };
}

function requireAuth() {
  if (!localStorage.getItem('adminToken')) {
    const err = new Error('Unauthorized');
    err.response = { status: 401 };
    throw err;
  }
}

const api = {
  async get(path, config = {}) {
    requireAuth();
    const params = config.params || {};
    const page = parseInt(params.page) || 1;
    const limit = params.limit === 'all' ? 0 : (parseInt(params.limit) || 20);

    if (path === '/stats') {
      const stats = await load('stats.json');
      return { data: { stats } };
    }

    if (path === '/users') {
      let users = await load('users.json');
      if (params.search) {
        const q = params.search.toLowerCase();
        users = users.filter(u =>
          u.phone?.includes(q) ||
          u.name?.toLowerCase().includes(q) ||
          u.displayName?.toLowerCase().includes(q)
        );
      }
      if (params.filter && params.filter !== '') {
        if (params.filter === 'completed') users = users.filter(u => u.postCount > 0);
        else if (params.filter === 'partial') users = users.filter(u => u.postCount === 0 && u.displayName);
        else if (params.filter === 'registered') users = users.filter(u => !u.displayName && u.postCount === 0);
      }
      const { data, pagination } = paginate(users, page, limit);
      return {
        data: {
          users: data.map(u => ({ ...u, _id: u.userId,
            completionStatus: u.postCount > 0 ? 'completed' : u.displayName ? 'partial' : 'registered',
            workflowStage: u.postCount > 0 ? 'completed' : 'registered',
          })),
          pagination,
        }
      };
    }

    const userMatch = path.match(/^\/users\/(.+)$/);
    if (userMatch) {
      const userId = userMatch[1];
      const [users, posts, votes] = await Promise.all([load('users.json'), load('posts.json'), load('votes.json')]);
      const user = users.find(u => u.userId === userId || u._id === userId);
      if (!user) { const e = new Error('Not found'); e.response = { status: 404, data: { message: 'User not found' } }; throw e; }
      const userPost = posts.find(p => p.userId === userId) || null;
      const userVotes = votes.filter(v => v.userId === userId).map(v => ({ ...v, _id: v.voteId }));
      return {
        data: {
          user: { ...user, _id: user.userId,
            completionStatus: userPost ? 'completed' : user.displayName ? 'partial' : 'registered',
            post: userPost ? { ...userPost, _id: userPost.postId } : null,
            votes: userVotes,
            workflow: null, quiz: null,
          }
        }
      };
    }

    if (path === '/posts') {
      let posts = await load('posts.json');
      posts = posts.map(p => ({
        ...p, _id: p.postId,
        userId: { _id: p.userId, phone: p.phone, displayName: p.displayName, name: p.realName },
      }));
      const approval = params.approval || params.approvalFilter || 'all';
      if (approval && approval !== 'all') {
        if (approval === 'not_submitted') posts = posts.filter(p => !p.submitted);
        else if (approval === 'ns_reminded') posts = posts.filter(p => p.adminReminderSent);
        else if (approval === 'nsr_clicked') posts = posts.filter(p => p.reminderLinkClicked);
        else posts = posts.filter(p => p.approvalStatus === approval);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        posts = posts.filter(p =>
          p.displayName?.toLowerCase().includes(q) ||
          p.realName?.toLowerCase().includes(q) ||
          p.phone?.includes(q) ||
          String(p.postNumber).includes(q) ||
          p.flavor?.toLowerCase().includes(q) ||
          p.postId?.toLowerCase().includes(q)
        );
      }
      posts = [...posts].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
      const { data, pagination } = paginate(posts, page, limit);
      return { data: { posts: data, pagination } };
    }

    const postMatch = path.match(/^\/posts\/(.+)$/);
    if (postMatch) {
      const postId = postMatch[1];
      const posts = await load('posts.json');
      const post = posts.find(p => p.postId === postId);
      if (!post) { const e = new Error('Not found'); e.response = { status: 404 }; throw e; }
      return { data: { post: { ...post, _id: post.postId } } };
    }

    if (path === '/votes') {
      const [votes, users] = await Promise.all([load('votes.json'), load('users.json')]);
      const userMap = {};
      users.forEach(u => { userMap[u.userId] = u; });
      const enriched = votes.map(v => ({
        ...v, _id: v.voteId,
        userId: v.userId ? { ...userMap[v.userId] } : null,
      }));
      const { data, pagination } = paginate(enriched, page, limit);
      return { data: { votes: data, pagination } };
    }

    if (path === '/workflows' || path === '/workflows/') {
      const [users, posts] = await Promise.all([load('users.json'), load('posts.json')]);
      const postByUser = {};
      posts.forEach(p => { if (p.userId) postByUser[p.userId] = p; });
      let workflows = users
        .filter(u => postByUser[u.userId])
        .map(u => {
          const post = postByUser[u.userId];
          return {
            _id: u.userId,
            userId: { _id: u.userId, phone: u.phone, displayName: u.displayName, name: u.name },
            currentStage: post.generationStatus === 'completed' ? 'completed' : post.approvalStatus,
            postId: post.postId,
            updatedAt: post.updatedAt || u.createdAt,
          };
        });
      if (params.search) {
        const q = params.search.toLowerCase();
        workflows = workflows.filter(w => w.userId.phone?.includes(q) || w.userId.displayName?.toLowerCase().includes(q));
      }
      if (params.stage && params.stage !== 'all') {
        workflows = workflows.filter(w => w.currentStage === params.stage);
      }
      const { data, pagination } = paginate(workflows, page, limit);
      return { data: { workflows: data, pagination } };
    }

    const workflowMatch = path.match(/^\/workflows\/(.+)$/);
    if (workflowMatch) {
      const userId = workflowMatch[1];
      const [users, posts] = await Promise.all([load('users.json'), load('posts.json')]);
      const user = users.find(u => u.userId === userId) || { _id: userId };
      const post = posts.find(p => p.userId === userId) || null;
      return { data: { workflow: { userId: user, currentStage: post?.generationStatus || 'unknown', stages: [] }, post } };
    }

    if (path.startsWith('/prompts')) return { data: { prompts: [] } };
    if (path.startsWith('/dynamic-prompts')) return { data: { chains: [] } };
    if (path.startsWith('/choco-images')) return { data: { images: [] } };
    if (path.startsWith('/places')) return { data: { places: [] } };
    if (path.startsWith('/reference-images')) return { data: { images: [] } };
    if (path.startsWith('/frame-overlays')) return { data: { overlays: [] } };
    if (path.startsWith('/queue')) return { data: { stats: { pending: 0, processing: 0, completed: 0, failed: 0 }, jobs: [], isRunning: false } };
    if (path.startsWith('/system-settings')) return { data: { settings: { voting_enabled: false } } };

    throw Object.assign(new Error('Not found'), { response: { status: 404 } });
  },

  async post(path, body = {}) {
    if (path === '/auth/login') {
      const { username, password } = body;
      if (username === 'admin' && password === 'Admin@2026') {
        return { data: { success: true, token: 'static-archive-token', admin: { username: 'admin', displayName: 'Admin' } } };
      }
      const err = new Error('Invalid credentials');
      err.response = { status: 401, data: { message: 'Invalid credentials' } };
      throw err;
    }
    console.warn('[Archive] Mutation ignored — read-only archive:', path);
    return { data: { success: true, message: 'Archive is read-only.' } };
  },

  async put(path) { console.warn('[Archive] PUT ignored:', path); return { data: { success: true } }; },
  async patch(path) { console.warn('[Archive] PATCH ignored:', path); return { data: { success: true } }; },
  async delete(path) { console.warn('[Archive] DELETE ignored:', path); return { data: { success: true } }; },

  interceptors: { request: { use: () => {} }, response: { use: () => {} } },
  defaults: { headers: { common: {} } },
};

export default api;
