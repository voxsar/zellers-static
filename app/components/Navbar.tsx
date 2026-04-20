"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Navbar() {
	return (
		<motion.nav
			initial={{ y: -80, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 md:px-12 backdrop-blur-md bg-[#1E0B4B]/85 border-b border-[#9D00FF]/15"
		>
			{/* Logo */}
			<Link href="/" className="flex items-center">
				<Image
					src="/logo.png"
					alt="Zellers AI Avurudu"
					width={120}
					height={48}
					className="h-10 w-auto object-contain"
					priority
				/>
			</Link>

			{/* Nav Actions */}
			<div className="flex items-center gap-1.5 sm:gap-3">
				<Link
					href="/gallery"
					className="text-xs sm:text-sm font-bold tracking-wide text-white/80 hover:text-yellow-400 transition-colors duration-200 px-2 hidden sm:block"
				>
					GALLERY
				</Link>
				<Link
					href="/winners"
					className="text-xs sm:text-sm font-bold tracking-wide text-black bg-linear-to-r from-yellow-500 to-amber-400 rounded-full px-3 sm:px-6 py-2 hover:scale-105 transition-transform duration-200 shadow-lg"
				>
					WINNERS
				</Link>
			</div>
		</motion.nav>
	);
}
