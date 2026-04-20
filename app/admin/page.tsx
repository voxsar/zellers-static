"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "Admin@2026";
const SESSION_KEY = "zellers_admin_session";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(SESSION_KEY) === "true") {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem(SESSION_KEY, "true");
        router.push("/admin/dashboard");
      } else {
        setError("Incorrect password.");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen bg-[#0a0520] flex items-center justify-center px-4">
      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-yellow-500/8 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-[#140b3a] border border-purple-500/20 rounded-3xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image src="/Avrudu-logo.png" alt="Zellers" width={120} height={48} className="object-contain" />
          <div className="flex items-center gap-2 text-yellow-400">
            <ShieldCheck size={18} />
            <span className="text-sm font-black tracking-widest uppercase">Admin Portal</span>
          </div>
          <p className="text-xs text-gray-500 text-center">Campaign archive — read-only dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter admin password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all pr-11"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center font-semibold">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-3.5 hover:brightness-110 hover:scale-[1.01] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/5 text-center">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors font-semibold">
            ← Back to public site
          </a>
        </div>
      </motion.div>
    </div>
  );
}
