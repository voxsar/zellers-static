"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Share2 } from "lucide-react";
import Navbar from "../components/Navbar";
import allPostsData from "../../src/data/posts.json";

// ── Types ─────────────────────────────────────────────────────────────────────
type Filter = "all" | "kumara" | "kumariya" | "top";

type Post = {
  postId: string;
  postNumber: number;
  displayName: string;
  gender: "male" | "female";
  flavor: string;
  imageUrl: string | null;
  voteCount: number;
  rank?: number;
  approvalStatus: string;
};

const APPROVED = (allPostsData as Post[]).filter(p => p.approvalStatus === "approved");

// Pre-compute rank within each gender for approved posts
const maleRanked = [...APPROVED.filter(p => p.gender === "male")]
  .sort((a, b) => b.voteCount - a.voteCount)
  .map((p, i) => ({ ...p, rank: i + 1 }));
const femaleRanked = [...APPROVED.filter(p => p.gender === "female")]
  .sort((a, b) => b.voteCount - a.voteCount)
  .map((p, i) => ({ ...p, rank: i + 1 }));
const rankMap: Record<string, number> = {};
[...maleRanked, ...femaleRanked].forEach(p => { rankMap[p.postId] = p.rank!; });
const POSTS_WITH_RANK: Post[] = APPROVED.map(p => ({ ...p, rank: rankMap[p.postId] }));

const PER_PAGE = 24;

// ── Placeholder Avatar ────────────────────────────────────────────────────────
function PlaceholderAvatar({ post }: { post: Post }) {
  const initials = post.displayName
    .split(" ")
    .map(w => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const gradient = post.gender === "male"
    ? "from-blue-700 via-indigo-700 to-violet-800"
    : "from-pink-600 via-rose-600 to-purple-700";
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <span className="text-5xl sm:text-6xl font-black text-white/25 select-none">{initials}</span>
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const isMale = post.gender === "male";
  const [imageError, setImageError] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  async function handleShare() {
    const url = window.location.origin + `/gallery?highlight=${post.postId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.displayName, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1500);
      }
    } catch { /* ignore */ }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-400/50 hover:-translate-y-1 transition-all duration-500 shadow-xl hover:shadow-[0_15px_40px_rgba(234,179,8,0.12)]"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        {post.imageUrl && !imageError ? (
          <Image
            src={post.imageUrl}
            alt={post.displayName}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderAvatar post={post} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0B4B]/95 via-[#1E0B4B]/10 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold text-gray-100 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10">
            #{post.postNumber}
          </span>
          <span className={`text-[9px] font-extrabold tracking-widest text-white rounded-full px-2.5 py-1 ${isMale ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gradient-to-r from-pink-500 to-rose-500"}`}>
            {isMale ? "KUMARA" : "KUMARIYA"}
          </span>
        </div>

        {/* Share button */}
        <div className="absolute bottom-2.5 right-2.5">
          <button
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-200"
            title={shareCopied ? "Copied!" : "Share"}
          >
            {shareCopied ? <span className="text-[9px] font-bold text-yellow-400">✓</span> : <Share2 size={13} />}
          </button>
        </div>
      </div>

      <div className="px-3 pt-2 pb-4">
        <p className="text-xs sm:text-sm font-bold text-gray-100 truncate">{post.displayName}</p>
        <p className="text-[10px] text-yellow-400/80 font-medium truncate mt-0.5">{post.flavor}</p>
        {post.rank && (
          <p className="text-[10px] text-purple-400/80 font-bold mt-0.5">Rank #{post.rank}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-black text-yellow-400">
            {post.voteCount.toLocaleString()}
            <span className="text-[9px] font-bold text-yellow-400/60 ml-1 uppercase">votes</span>
          </span>
          <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase bg-gray-500/10 border border-gray-500/20 rounded-full px-2.5 py-1">
            CLOSED
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list: Post[] =
      filter === "kumara" ? maleRanked :
      filter === "kumariya" ? femaleRanked :
      filter === "top" ? [
        ...maleRanked.slice(0, 10),
        ...femaleRanked.slice(0, 10),
      ].sort((a, b) => b.voteCount - a.voteCount) :
      [...POSTS_WITH_RANK].sort((a, b) => b.voteCount - a.voteCount);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.displayName.toLowerCase().includes(q) ||
        p.flavor.toLowerCase().includes(q) ||
        String(p.postNumber).includes(q)
      );
    }
    return list;
  }, [filter, query]);

  const totalPages = filter === "top" ? 1 : Math.ceil(filtered.length / PER_PAGE);
  const paginated = filter === "top" ? filtered : filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const FILTERS: { key: Filter; label: string; dot?: string }[] = [
    { key: "all", label: "All" },
    { key: "kumara", label: "Kumara", dot: "bg-blue-400" },
    { key: "kumariya", label: "Kumariya", dot: "bg-pink-400" },
    { key: "top", label: "Top 20", dot: "bg-yellow-400" },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#1E0B4B]">
        <div className="absolute -top-[20%] -right-[10%] w-[250px] sm:w-[600px] h-[250px] sm:h-[600px] rounded-full bg-[#00E5FF]/30 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[250px] sm:w-[600px] h-[250px] sm:h-[600px] rounded-full bg-[#00E5FF]/30 blur-[120px]" />
        <div className="absolute top-[10%] left-[20%] w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] rounded-full bg-[#9D00FF]/25 blur-[140px]" />
      </div>

      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-4 pt-28 sm:pt-36 pb-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-10">
          <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-red-400 border border-red-500/40 bg-red-500/10 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            VOTING CLOSED
          </span>
          <h1 className="font-playfair text-3xl sm:text-5xl font-normal text-white tracking-tight">
            AVATAR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">GALLERY</span>
          </h1>
          <p className="text-base text-yellow-100/70 font-semibold">
            {APPROVED.length} approved avatars · Competition ended
          </p>
          <Link
            href="/winners"
            className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold tracking-widest text-black bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full px-8 py-3 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,179,8,0.4)]"
          >
            🏆 SEE WINNERS
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1); setQuery(""); }}
              className={[
                "inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full px-4 sm:px-5 py-2 border transition-all duration-300",
                filter === f.key
                  ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-400"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {f.dot && <span className={`w-2 h-2 rounded-full ${f.dot}`} />}
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        {filter !== "top" && (
          <div className="relative max-w-lg mx-auto mb-8">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by name, flavor, or post number…"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-10 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 transition-all"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white bg-white/10 rounded-full p-1"
                >
                  <X size={13} />
                </motion.button>
              )}
            </AnimatePresence>
            {query && (
              <p className="text-center text-[11px] text-yellow-400/70 mt-2 font-bold uppercase tracking-widest">
                {filtered.length === 0 ? `No results for "${query}"` : `${filtered.length} found`}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-bold">
            No posts match your search.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {paginated.map(post => (
                <PostCard key={post.postId} post={post} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {filter !== "top" && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white text-sm font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >‹</button>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={[
                    "w-9 h-9 flex items-center justify-center rounded-full text-xs font-extrabold border transition-all",
                    p === page
                      ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-400"
                      : "border-white/15 bg-white/5 text-gray-300 hover:bg-white/10",
                  ].join(" ")}
                >{p}</button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white text-sm font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >›</button>
          </div>
        )}

        <p className="text-center text-xs text-white/25 mt-4 font-semibold uppercase tracking-widest">
          Page {page} of {totalPages} · {filter === "top" ? paginated.length : filtered.length} entries
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
          <Image src="/Avrudu-logo.png" alt="AI Avurudu with Zellers" width={140} height={56} className="object-contain opacity-80" />
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {[{ label: "TERMS", href: "/terms" }, { label: "PRIVACY", href: "/privacy" }, { label: "FAQ", href: "/faq" }, { label: "CONTACT", href: "/contact" }].map(l => (
              <Link key={l.label} href={l.href} className="text-xs font-bold text-white/50 hover:text-yellow-400 tracking-[0.2em] transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-[10px] text-white/25 font-bold tracking-widest text-center uppercase">
            © 2026 Zellers Chocolates. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
