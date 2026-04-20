"use client";

import { motion } from "framer-motion";
import { Users, ImageIcon, ThumbsUp, CheckCircle, XCircle, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import AdminLayout from "../AdminLayout";
import statsData from "../../../src/data/stats.json";
import winnersData from "../../../src/data/winners.json";
import Image from "next/image";

type StatCardProps = { label: string; value: number | string; icon: React.ReactNode; color: string; href?: string };

function StatCard({ label, value, icon, color, href }: StatCardProps) {
  const inner = (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-${color}/30 transition-all duration-300 group cursor-default`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}/10 text-${color}`}>
          {icon}
        </div>
        {href && <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors font-bold tracking-widest">VIEW →</span>}
      </div>
      <p className="text-2xl font-black text-white">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function Dashboard() {
  const stats = statsData as {
    totalUsers: number;
    totalPosts: number;
    approvedPosts: number;
    pendingPosts: number;
    rejectedPosts: number;
    totalVotes: number;
    totalQuizzes: number;
    maleApproved: number;
    femaleApproved: number;
    exportedAt: string;
  };

  const cards: StatCardProps[] = [
    { label: "Total Users", value: stats.totalUsers, icon: <Users size={18} />, color: "blue-400", href: "/admin/users" },
    { label: "Total Posts", value: stats.totalPosts, icon: <ImageIcon size={18} />, color: "purple-400", href: "/admin/posts" },
    { label: "Approved Posts", value: stats.approvedPosts, icon: <CheckCircle size={18} />, color: "green-400" },
    { label: "Pending Posts", value: stats.pendingPosts, icon: <Clock size={18} />, color: "yellow-400" },
    { label: "Rejected Posts", value: stats.rejectedPosts, icon: <XCircle size={18} />, color: "red-400" },
    { label: "Total Votes Cast", value: stats.totalVotes, icon: <ThumbsUp size={18} />, color: "amber-400", href: "/admin/votes" },
    { label: "Quiz Completions", value: stats.totalQuizzes, icon: <Trophy size={18} />, color: "cyan-400" },
    { label: "Male Avatars", value: stats.maleApproved, icon: <ImageIcon size={18} />, color: "blue-400" },
    { label: "Female Avatars", value: stats.femaleApproved, icon: <ImageIcon size={18} />, color: "pink-400" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-xl font-black text-white">Campaign Overview</h2>
          <p className="text-xs text-gray-500 mt-1">
            Data snapshot from{" "}
            <span className="text-gray-400 font-semibold">
              {new Date(stats.exportedAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}
            </span>
          </p>
        </div>

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <StatCard {...card} />
            </motion.div>
          ))}
        </motion.div>

        {/* Winners preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-white">Top Winners</h3>
            <Link href="/winners" className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors tracking-widest">
              VIEW FULL →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Top female */}
            <div className="bg-white/5 border border-pink-500/20 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-pink-400 tracking-widest uppercase mb-3">
                🏆 #1 Kumariya
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={winnersData.female[0].localImage}
                    alt={winnersData.female[0].displayName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-white text-sm truncate">{winnersData.female[0].displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{winnersData.female[0].realName}</p>
                  <p className="text-sm font-black text-yellow-400 mt-1">
                    {winnersData.female[0].voteCount.toLocaleString()} <span className="text-[10px] font-bold text-yellow-400/50">votes</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Top male */}
            <div className="bg-white/5 border border-blue-500/20 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-blue-400 tracking-widest uppercase mb-3">
                🏆 #1 Kumara
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={winnersData.male[0].localImage}
                    alt={winnersData.male[0].displayName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-white text-sm truncate">{winnersData.male[0].displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{winnersData.male[0].realName}</p>
                  <p className="text-sm font-black text-yellow-400 mt-1">
                    {winnersData.male[0].voteCount.toLocaleString()} <span className="text-[10px] font-bold text-yellow-400/50">votes</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/admin/posts", label: "Browse Posts", sub: `${stats.approvedPosts} approved` },
            { href: "/admin/users", label: "Browse Users", sub: `${stats.totalUsers} registered` },
            { href: "/admin/votes", label: "Browse Votes", sub: `${stats.totalVotes} cast` },
            { href: "/gallery", label: "Public Gallery", sub: "Open in same tab" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
            >
              <p className="text-sm font-black text-white group-hover:text-yellow-400 transition-colors">{item.label}</p>
              <p className="text-[10px] text-gray-600 mt-1 font-semibold">{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
