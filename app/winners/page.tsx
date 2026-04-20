"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
// Image import kept for the logo in the footer
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

const RANK_COLORS = [
  "from-yellow-400 to-amber-500",   // 1st
  "from-gray-300 to-gray-400",      // 2nd
  "from-amber-600 to-amber-700",    // 3rd
];
const RANK_LABELS = ["🥇 1st Place", "🥈 2nd Place", "🥉 3rd Place"];
const CROWN = ["👑", "🏅", "🏅", "", "", "", "", "", "", ""];

function WinnerCard({ winner, delay = 0 }: { winner: Winner; delay?: number }) {
  const isTop3 = winner.rank <= 3;
  const colorClass = isTop3 ? RANK_COLORS[winner.rank - 1] : "from-purple-700 to-indigo-800";
  const isMale = winner.gender === "male";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={[
        "relative flex flex-col overflow-hidden rounded-2xl shadow-2xl border transition-all duration-500 hover:-translate-y-1",
        isTop3
          ? "border-yellow-400/50 shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.35)]"
          : "border-white/10 hover:border-purple-400/30",
      ].join(" ")}
    >
      {/* Rank badge */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colorClass}`} />

      {/* Image — plain img tag so aborted requests auto-retry without triggering permanent error state */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#1a0f4e]">
        <div className={`absolute inset-0 bg-gradient-to-br ${isMale ? "from-blue-800 to-indigo-900" : "from-pink-800 to-purple-900"} flex items-center justify-center`}>
          <span className="text-4xl font-black text-white/10">{winner.displayName.slice(0, 2).toUpperCase()}</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={winner.localImage}
          alt={winner.displayName}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0828]/90 via-[#0f0828]/10 to-transparent" />

        {/* Crown / rank overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {CROWN[winner.rank - 1] && (
            <span className="text-2xl leading-none drop-shadow-lg">{CROWN[winner.rank - 1]}</span>
          )}
          <span className={`text-[10px] font-extrabold tracking-widest text-white rounded-full px-2.5 py-1 shadow-lg bg-gradient-to-r ${colorClass}`}>
            {isTop3 ? RANK_LABELS[winner.rank - 1] : `#${winner.rank}`}
          </span>
        </div>

        {/* Gender badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[9px] font-extrabold tracking-widest text-white rounded-full px-2.5 py-1 ${isMale ? "bg-blue-500/80" : "bg-pink-500/80"}`}>
            {isMale ? "KUMARA" : "KUMARIYA"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#0f0828] px-4 pt-3 pb-5">
        <p className="text-sm sm:text-base font-black text-white truncate">{winner.displayName}</p>
        <p className="text-[10px] text-white/40 font-medium truncate mt-0.5">{winner.realName}</p>
        <p className="text-[10px] text-yellow-400/70 font-medium truncate mt-0.5">{winner.flavor}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-black text-yellow-400 drop-shadow">
            {winner.voteCount.toLocaleString()}
            <span className="text-[10px] font-bold text-yellow-400/50 ml-1">votes</span>
          </span>
          {isTop3 && (
            <span className={`text-[10px] font-extrabold tracking-widest text-black rounded-full px-3 py-1 bg-gradient-to-r ${colorClass}`}>
              WINNER
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function WinnersPage() {
  const [tab, setTab] = useState<"male" | "female">("female");
  const winners = tab === "male" ? winnersData.male : winnersData.female;

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#0f0828]">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-yellow-500/10 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[160px]" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-[140px]" />
      </div>

      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 pt-28 sm:pt-36 pb-20">

        {/* Hero header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-5xl sm:text-6xl"
          >
            🏆
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-playfair text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight"
          >
            COMPETITION{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
              WINNERS
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base sm:text-lg text-yellow-100/70 font-semibold max-w-xl"
          >
            AI Avurudu with Zellers Chocolates — 2026 Avurudu Season Champions
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-yellow-400 border border-yellow-500/40 bg-yellow-500/10 rounded-full px-5 py-2"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            OFFICIAL RESULTS
          </motion.div>
        </div>

        {/* Gender tabs */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setTab("female")}
            className={[
              "flex items-center gap-2 text-sm font-extrabold tracking-widest rounded-full px-7 py-3 border transition-all duration-300",
              tab === "female"
                ? "bg-pink-500/20 border-pink-400/60 text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10",
            ].join(" ")}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
            KUMARIYA
          </button>
          <button
            onClick={() => setTab("male")}
            className={[
              "flex items-center gap-2 text-sm font-extrabold tracking-widest rounded-full px-7 py-3 border transition-all duration-300",
              tab === "male"
                ? "bg-blue-500/20 border-blue-400/60 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10",
            ].join(" ")}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            KUMARA
          </button>
        </div>

        {/* Top 3 podium */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + "-podium"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* 2nd on the left, 1st in centre, 3rd on right for podium effect */}
              {[winners[1], winners[0], winners[2]].map((w, i) => (
                <div key={w.rank} className={i === 1 ? "sm:-mt-6 sm:scale-105" : ""}>
                  <WinnerCard winner={w} delay={i * 0.08} />
                </div>
              ))}
            </div>

            {/* 4–10 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {winners.slice(3).map((w, i) => (
                <WinnerCard key={w.rank} winner={w} delay={0.3 + i * 0.06} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* See all link */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <p className="text-sm text-white/40 font-semibold">Want to see all avatars?</p>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-extrabold tracking-widest text-white border-2 border-white/20 bg-white/5 rounded-full px-8 py-3 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
          >
            VIEW FULL GALLERY →
          </Link>
        </div>
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
