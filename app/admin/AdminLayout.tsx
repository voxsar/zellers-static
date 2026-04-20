"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Users, ImageIcon, ThumbsUp, Trophy,
  LogOut, Menu, X, ChevronRight,
} from "lucide-react";

const SESSION_KEY = "zellers_admin_session";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Posts", href: "/admin/posts", icon: ImageIcon },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Votes", href: "/admin/votes", icon: ThumbsUp },
  { label: "Winners", href: "/winners", icon: Trophy },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem(SESSION_KEY) !== "true") {
        router.replace("/admin");
      } else {
        setAuthed(true);
      }
    }
  }, [router]);

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    router.push("/admin");
  }

  if (!authed) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Image src="/Avrudu-logo.png" alt="Zellers" width={100} height={40} className="object-contain" />
        <p className="text-[10px] text-yellow-400/70 font-bold tracking-widest uppercase mt-2">Admin Archive</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                active
                  ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <Icon size={16} className="shrink-0" />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <a
          href="/"
          className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all duration-200"
        >
          ← Public Site
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080418] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#0f0828] border-r border-white/5 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-56 bg-[#0f0828] border-r border-white/10 flex flex-col z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-[#0f0828]/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-black text-white tracking-wide">
            {NAV.find(n => pathname === n.href || pathname.startsWith(n.href))?.label ?? "Admin"}
          </h1>
          <span className="ml-auto text-[10px] text-gray-600 font-bold tracking-widest uppercase">
            Read-only archive
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
