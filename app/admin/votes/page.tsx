"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import AdminLayout from "../AdminLayout";
import allVotesData from "../../../src/data/votes.json";
import allPostsData from "../../../src/data/posts.json";
import allUsersData from "../../../src/data/users.json";

type Vote = { voteId: string; userId: string | null; postId: string; createdAt: string };
type Post = { postId: string; displayName: string; postNumber: number; gender: string; voteCount: number };
type User = { userId: string; phone: string; displayName: string };

export default function VotesAdmin() {
  const votes = allVotesData as Vote[];
  const posts = allPostsData as Post[];
  const users = allUsersData as User[];

  const postMap = useMemo(() => {
    const m: Record<string, Post> = {};
    posts.forEach(p => { m[p.postId] = p; });
    return m;
  }, [posts]);

  const userMap = useMemo(() => {
    const m: Record<string, User> = {};
    users.forEach(u => { m[u.userId] = u; });
    return m;
  }, [users]);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 40;

  const filtered = useMemo(() => {
    let list = [...votes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(v => {
        const post = postMap[v.postId];
        const user = v.userId ? userMap[v.userId] : null;
        return (
          v.postId.toLowerCase().includes(q) ||
          post?.displayName?.toLowerCase().includes(q) ||
          String(post?.postNumber).includes(q) ||
          user?.phone?.includes(q) ||
          user?.displayName?.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [votes, query, postMap, userMap]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Top voted posts
  const topPosts = useMemo(() => {
    return [...posts]
      .filter(p => p.voteCount > 0)
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 5);
  }, [posts]);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-black text-white">Votes</h2>
          <p className="text-xs text-gray-500 mt-0.5">{votes.length} total votes cast</p>
        </div>

        {/* Top 5 posts */}
        <div className="bg-white/5 border border-yellow-500/20 rounded-2xl p-5">
          <h3 className="text-xs font-black text-yellow-400 tracking-widest uppercase mb-4">Top 5 Most Voted Posts</h3>
          <div className="space-y-2">
            {topPosts.map((post, i) => (
              <div key={post.postId} className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-500 w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{post.displayName}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${post.gender === "male" ? "text-blue-400 bg-blue-500/10" : "text-pink-400 bg-pink-500/10"}`}>
                      {post.gender === "male" ? "KUMARA" : "KUMARIYA"}
                    </span>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-full h-1.5 mt-1">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
                      style={{ width: `${Math.round((post.voteCount / topPosts[0].voteCount) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-black text-yellow-400 whitespace-nowrap">{post.voteCount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Post name, phone, post ID…"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-8 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50 transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>
          <span className="text-xs text-gray-600 font-semibold">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {["#", "Post", "Post #", "Voter Phone", "Voter Name", "Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-extrabold tracking-widest text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((vote, i) => {
                  const post = postMap[vote.postId];
                  const user = vote.userId ? userMap[vote.userId] : null;
                  return (
                    <tr key={vote.voteId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-gray-600 font-mono">{(page - 1) * PER_PAGE + i + 1}</td>
                      <td className="px-4 py-3 font-bold text-white">{post?.displayName ?? vote.postId}</td>
                      <td className="px-4 py-3 text-gray-400">#{post?.postNumber ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-blue-300">{user?.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-400">{user?.displayName ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600 text-[10px] whitespace-nowrap">
                        {vote.createdAt ? new Date(vote.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-all">‹ Prev</button>
            <span className="text-xs text-gray-500 font-semibold">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-all">Next ›</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
