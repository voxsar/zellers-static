"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import winnersData from "../../src/data/winners.json";

type Winner = {
  rank: number;
  displayName: string;
  realName: string;
  gender: string;
  flavor: string;
  voteCount: number;
  localImage: string;
};

// ─── Winner Card ─────────────────────────────────────────────────────────────
// Uses the exact same visual language as PostCard in VotePageClient
function WinnerCard({ winner, delay = 0 }: { winner: Winner; delay?: number }) {
  const isMale = winner.gender === "male";
  const isFirst = winner.rank === 1;
  const isTop3 = winner.rank <= 3;

  const rankGradient =
    winner.rank === 1 ? "from-yellow-400 to-amber-500" :
    winner.rank === 2 ? "from-gray-300 to-gray-400" :
    winner.rank === 3 ? "from-amber-600 to-amber-700" :
    "from-purple-500 to-indigo-500";

  const rankLabel =
    winner.rank === 1 ? "👑 1st Place" :
    winner.rank === 2 ? "🥈 2nd Place" :
    winner.rank === 3 ? "🥉 3rd Place" :
    `#${winner.rank}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={[
        "group relative flex flex-col bg-white/5 backdrop-blur-xl border rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-xl",
        isFirst
          ? "border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:shadow-[0_20px_60px_rgba(234,179,8,0.5)] ring-2 ring-yellow-400/20"
          : isTop3
          ? "border-yellow-400/40 shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.25)] hover:border-yellow-400/60"
          : "border-white/10 hover:border-yellow-400/30 hover:shadow-[0_15px_40px_rgba(234,179,8,0.1)]",
      ].join(" ")}
    >
      {/* Image area */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        {/* Gradient placeholder shown while image loads */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isMale ? "from-blue-700 via-indigo-700 to-violet-800" : "from-pink-600 via-rose-600 to-purple-700"} flex items-center justify-center`}>
          <span className="text-5xl sm:text-6xl font-black text-white/10 select-none">
            {winner.displayName.split(" ").map(w => w[0] ?? "").join("").toUpperCase().slice(0, 2)}
          </span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={winner.localImage}
          alt={winner.displayName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="eager"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0B4B]/95 via-[#1E0B4B]/20 to-transparent" />

        {/* Rank badge top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          <span className={`text-[10px] font-extrabold tracking-widest text-black rounded-full px-2.5 py-1 shadow-lg bg-gradient-to-r ${rankGradient}`}>
            {rankLabel}
          </span>
          <span className={`text-[9px] font-extrabold tracking-widest text-white rounded-full px-2.5 py-1 shadow-md ${isMale ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gradient-to-r from-pink-500 to-rose-500"}`}>
            {isMale ? "KUMARA" : "KUMARIYA"}
          </span>
        </div>

        {/* Gold crown for #1 */}
        {isFirst && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
            className="absolute top-2.5 right-2.5"
          >
            <span className="text-2xl drop-shadow-lg">👑</span>
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 sm:gap-2 px-2.5 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-5 relative z-10">
        <p className="text-xs sm:text-sm font-bold text-gray-100 leading-tight drop-shadow-sm truncate" title={winner.displayName}>
          {winner.displayName}
        </p>
        <p className="text-[10px] sm:text-[11px] text-yellow-400/80 font-medium truncate">{winner.flavor}</p>
        <p className="text-[10px] sm:text-[11px] text-white/40 font-medium truncate">{winner.realName}</p>

        <div className="flex items-center justify-between mt-1 sm:mt-2 gap-1 sm:gap-2">
          <span className="text-sm sm:text-base font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
            {winner.voteCount.toLocaleString()}
            <span className="text-[8px] sm:text-[10px] font-bold text-yellow-400/60 ml-0.5 sm:ml-1 tracking-wider uppercase">votes</span>
          </span>
          <span className={`text-[9px] sm:text-[10px] font-extrabold tracking-widest rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r ${rankGradient} ${isTop3 ? "text-black" : "text-white"}`}>
            {isTop3 ? "WINNER" : "TOP 10"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WinnersPage() {
  const [tab, setTab] = useState<"female" | "male">("female");
  const winners = (tab === "female" ? winnersData.female : winnersData.male) as Winner[];

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative">

      {/* Exact same background as VotePageClient */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#1E0B4B]">
        <div className="absolute -top-[20%] -right-[10%] w-[250px] sm:w-150 md:w-200 h-[250px] sm:h-150 md:h-200 rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[250px] sm:w-150 md:w-200 h-[250px] sm:h-150 md:h-200 rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />
        <div className="absolute top-[10%] left-[20%] w-[200px] sm:w-125 h-[200px] sm:h-125 rounded-full bg-[#9D00FF]/30 blur-[100px] sm:blur-[140px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[200px] sm:w-125 h-[200px] sm:h-125 rounded-full bg-[#6A00F4]/30 blur-[100px] sm:blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-100 h-[150px] sm:h-100 rounded-full bg-yellow-500/10 blur-[80px] sm:blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-3 sm:px-4 pt-24 sm:pt-32 pb-12 sm:pb-20">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-yellow-400 border border-yellow-500/40 bg-yellow-500/10 rounded-full px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.15)]">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              OFFICIAL RESULTS
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-yellow-400 mt-2">
            AI AVURUDU WITH ZELLERS — 2026
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }} className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight drop-shadow-lg">
            COMPETITION{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-amber-500">WINNERS</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="text-base sm:text-lg md:text-xl font-bold text-yellow-100/90">
            ජය ගත් AI අවුරුදු රාජකීයයන්
          </motion.p>
        </div>

        {/* Gender tabs — same style as FILTERS in VotePageClient */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }} className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-8 sm:mb-12">
          {([
            { key: "female", label: "Kumariya", dot: "bg-pink-400" },
            { key: "male", label: "Kumara", dot: "bg-blue-400" },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setTab(f.key)}
              className={[
                "inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full px-3 sm:px-5 py-2 sm:py-2.5 border transition-all duration-300",
                tab === f.key
                  ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-md",
              ].join(" ")}
            >
              <span className={`w-2 h-2 rounded-full shadow-sm ${f.dot}`} />
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Grid — same 4-column layout as VotePageClient */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={tab}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            {winners.map((winner, i) => (
              <WinnerCard key={`${tab}-${winner.rank}`} winner={winner} delay={i * 0.06} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 sm:mt-28 flex flex-col items-center gap-4 sm:gap-5"
        >
          <p className="text-lg font-black text-white tracking-wide">
            සියළු Avatar නරඹන්න
          </p>
          <Link
            href="/vote"
            className="inline-flex items-center justify-center gap-2 text-sm font-extrabold tracking-widest text-black bg-linear-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full px-10 py-4 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_30px_rgba(234,179,8,0.6)] uppercase"
          >
            VIEW FULL GALLERY →
          </Link>
        </motion.div>

      </div>

      {/* Footer — same as VotePageClient */}
      <footer className="relative z-10 bg-transparent border-t border-white/10 py-12 mt-auto">
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="relative w-40 h-20">
            <Image src="/Avrudu-logo.png" alt="AI Avurudu with Zellers Chocolates" fill className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
          </div>
          <nav aria-label="Winners page footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[{ label: "TERMS", href: "/terms" }, { label: "PRIVACY", href: "/privacy" }, { label: "FAQ", href: "/faq" }, { label: "CONTACT", href: "/contact" }].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs font-bold text-white/50 hover:text-yellow-400 tracking-[0.2em] transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-[10px] font-bold text-white/30 tracking-widest text-center uppercase mt-4">
            © 2026 Zellers Chocolates. All rights reserved.
          </p>
        </div>
      </footer>

      <div className="h-16 sm:h-8" aria-hidden="true" />
    </div>
  );
}
