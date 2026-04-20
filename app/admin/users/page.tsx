"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import AdminLayout from "../AdminLayout";
import allUsersData from "../../../src/data/users.json";

type User = {
  userId: string;
  phone: string;
  name: string;
  displayName: string;
  gender: string;
  registrationMethod: string;
  postCount: number;
  votesGiven: number;
  createdAt: string;
};

export default function UsersAdmin() {
  const users = allUsersData as User[];
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "votes" | "posts">("date");
  const [page, setPage] = useState(1);
  const PER_PAGE = 30;

  const filtered = useMemo(() => {
    let list = [...users];
    if (methodFilter !== "all") list = list.filter(u => u.registrationMethod === methodFilter);
    if (genderFilter !== "all") list = list.filter(u => u.gender === genderFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(u =>
        u.phone?.includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.displayName?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) =>
      sortBy === "votes" ? b.votesGiven - a.votesGiven :
      sortBy === "posts" ? b.postCount - a.postCount :
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return list;
  }, [users, query, methodFilter, genderFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const smsCount = users.filter(u => u.registrationMethod === "sms").length;
  const waCount = users.filter(u => u.registrationMethod === "whatsapp").length;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h2 className="text-xl font-black text-white">Users</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {users.length} registered users · {smsCount} via SMS · {waCount} via WhatsApp
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Phone, name, display name…"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-8 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50 transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>

          <select
            value={methodFilter}
            onChange={e => { setMethodFilter(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-full px-3 py-2 outline-none"
          >
            <option value="all" className="bg-[#0f0828]">All methods</option>
            <option value="sms" className="bg-[#0f0828]">SMS ({smsCount})</option>
            <option value="whatsapp" className="bg-[#0f0828]">WhatsApp ({waCount})</option>
          </select>

          <select
            value={genderFilter}
            onChange={e => { setGenderFilter(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-full px-3 py-2 outline-none"
          >
            <option value="all" className="bg-[#0f0828]">All genders</option>
            <option value="male" className="bg-[#0f0828]">Male</option>
            <option value="female" className="bg-[#0f0828]">Female</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white/5 border border-white/10 text-gray-300 text-xs font-bold rounded-full px-3 py-2 outline-none"
          >
            <option value="date" className="bg-[#0f0828]">Sort: Newest</option>
            <option value="votes" className="bg-[#0f0828]">Sort: Most votes</option>
            <option value="posts" className="bg-[#0f0828]">Sort: Most posts</option>
          </select>

          <span className="text-xs text-gray-600 font-semibold ml-auto">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {["Phone", "Name", "Display Name", "Gender", "Method", "Posts", "Votes Given", "Registered"].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-extrabold tracking-widest text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(user => (
                  <tr key={user.userId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-300 whitespace-nowrap">{user.phone}</td>
                    <td className="px-4 py-3 text-gray-300 font-semibold">{user.name || "—"}</td>
                    <td className="px-4 py-3 font-bold text-white">{user.displayName || "—"}</td>
                    <td className="px-4 py-3">
                      {user.gender ? (
                        <span className={`text-[10px] font-extrabold tracking-widest rounded-full px-2 py-0.5 ${user.gender === "male" ? "text-blue-400 bg-blue-500/10" : "text-pink-400 bg-pink-500/10"}`}>
                          {user.gender.toUpperCase()}
                        </span>
                      ) : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-extrabold tracking-widest rounded-full px-2 py-0.5 ${user.registrationMethod === "whatsapp" ? "text-green-400 bg-green-500/10" : "text-purple-400 bg-purple-500/10"}`}>
                        {user.registrationMethod === "whatsapp" ? "WA" : "SMS"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-yellow-400">{user.postCount}</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-400">{user.votesGiven}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-[10px]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB") : "—"}
                    </td>
                  </tr>
                ))}
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
