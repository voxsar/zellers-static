"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, X, Filter } from "lucide-react";
import AdminLayout from "../AdminLayout";
import allPostsData from "../../../src/data/posts.json";

type Post = {
  postId: string;
  postNumber: number;
  displayName: string;
  realName: string;
  phone: string;
  gender: string;
  flavor: string;
  imageUrl: string | null;
  approvalStatus: string;
  generationStatus: string;
  rejectionReason: string | null;
  voteCount: number;
  createdAt: string;
  rank?: number;
};

const STATUS_COLORS: Record<string, string> = {
  approved: "text-green-400 bg-green-500/10 border-green-500/30",
  pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  rejected: "text-red-400 bg-red-500/10 border-red-500/30",
};

const GEN_COLORS: Record<string, string> = {
  completed: "text-green-400",
  failed: "text-red-400",
  processing: "text-yellow-400",
  queued: "text-blue-400",
};

export default function PostsAdmin() {
  const posts = allPostsData as Post[];
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"votes" | "number" | "date">("votes");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const PER_PAGE = 25;

  const filtered = useMemo(() => {
    let list = [...posts];
    if (statusFilter !== "all") list = list.filter(p => p.approvalStatus === statusFilter);
    if (genderFilter !== "all") list = list.filter(p => p.gender === genderFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.displayName.toLowerCase().includes(q) ||
        p.realName?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        String(p.postNumber).includes(q) ||
        p.flavor?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) =>
      sortBy === "votes" ? b.voteCount - a.voteCount :
      sortBy === "number" ? a.postNumber - b.postNumber :
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return list;
  }, [posts, query, statusFilter, genderFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => ({
    all: posts.length,
    approved: posts.filter(p => p.approvalStatus === "approved").length,
    pending: posts.filter(p => p.approvalStatus === "pending").length,
    rejected: posts.filter(p => p.approvalStatus === "rejected").length,
  }), [posts]);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Posts</h2>
            <p className="text-xs text-gray-500 mt-0.5">{posts.length} total submissions</p>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", "approved", "pending", "rejected"] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={[
                "text-[10px] font-extrabold tracking-widest uppercase rounded-full px-4 py-1.5 border transition-all",
                statusFilter === s
                  ? s === "all" ? "bg-white/10 border-white/30 text-white"
                    : STATUS_COLORS[s]
                  : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300",
              ].join(" ")}
            >
              {s} ({counts[s]})
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Name, phone, flavor, post #…"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-8 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50 transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Gender filter */}
          <div className="flex items-center gap-1">
            <Filter size={12} className="text-gray-600" />
            <select
              value={genderFilter}
              onChange={e => { setGenderFilter(e.target.value); setPage(1); }}
              className="bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-full px-3 py-2 outline-none focus:border-yellow-400/50"
            >
              <option value="all" className="bg-[#0f0828]">All genders</option>
              <option value="male" className="bg-[#0f0828]">Male</option>
              <option value="female" className="bg-[#0f0828]">Female</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-full px-3 py-2 outline-none focus:border-yellow-400/50"
          >
            <option value="votes" className="bg-[#0f0828]">Sort: Most votes</option>
            <option value="number" className="bg-[#0f0828]">Sort: Post #</option>
            <option value="date" className="bg-[#0f0828]">Sort: Newest</option>
          </select>

          <span className="text-xs text-gray-600 font-semibold ml-auto">
            {filtered.length} results
          </span>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {["Post #", "Avatar", "Name / Display", "Gender", "Flavor", "Status", "Gen", "Votes", "Submitted"].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-extrabold tracking-widest text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(post => (
                  <>
                    <tr
                      key={post.postId}
                      onClick={() => setExpanded(expanded === post.postId ? null : post.postId)}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-gray-300 whitespace-nowrap">#{post.postNumber || "—"}</td>
                      <td className="px-4 py-3">
                        {post.imageUrl ? (
                          <div className="relative w-10 h-12 rounded-lg overflow-hidden">
                            <Image src={post.imageUrl} alt={post.displayName} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className={`w-10 h-12 rounded-lg flex items-center justify-center text-white/20 font-black text-sm ${post.gender === "male" ? "bg-blue-900/50" : "bg-pink-900/50"}`}>
                            {post.displayName.slice(0, 1)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-white">{post.displayName}</p>
                        <p className="text-gray-600 text-[10px]">{post.realName}</p>
                        <p className="text-gray-700 text-[10px] font-mono">{post.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-extrabold tracking-widest rounded-full px-2 py-0.5 ${post.gender === "male" ? "text-blue-400 bg-blue-500/10" : "text-pink-400 bg-pink-500/10"}`}>
                          {post.gender?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 max-w-32 truncate" title={post.flavor}>{post.flavor}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-extrabold tracking-widest rounded-full px-2 py-0.5 border ${STATUS_COLORS[post.approvalStatus] ?? "text-gray-400 bg-gray-500/10 border-gray-500/30"}`}>
                          {post.approvalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold ${GEN_COLORS[post.generationStatus] ?? "text-gray-500"}`}>
                          {post.generationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-black text-yellow-400">{post.voteCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-[10px]">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-GB") : "—"}
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expanded === post.postId && (
                      <tr key={post.postId + "-expanded"} className="bg-white/3">
                        <td colSpan={9} className="px-4 py-4">
                          <div className="flex flex-wrap gap-4 text-xs">
                            <div>
                              <p className="text-gray-500 font-bold uppercase tracking-widest mb-1">Post ID</p>
                              <p className="text-gray-300 font-mono">{post.postId}</p>
                            </div>
                            {post.rejectionReason && (
                              <div>
                                <p className="text-red-500 font-bold uppercase tracking-widest mb-1">Rejection Reason</p>
                                <p className="text-red-300">{post.rejectionReason}</p>
                              </div>
                            )}
                            {post.imageUrl && (
                              <div>
                                <p className="text-gray-500 font-bold uppercase tracking-widest mb-1">Image URL</p>
                                <a href={post.imageUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 font-mono break-all text-[10px]">
                                  {post.imageUrl.slice(0, 80)}…
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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
