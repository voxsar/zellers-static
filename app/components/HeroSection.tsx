"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const floatVariants = {
	animate: {
		y: [0, -12, 0],
		transition: {
			duration: 5,
			repeat: Infinity,
			ease: "easeInOut" as const,
		},
	},
};

const STAR_SIZES = [
	{ w: 2.1, h: 1.8 }, { w: 1.5, h: 2.3 }, { w: 2.8, h: 1.4 },
	{ w: 1.2, h: 2.7 }, { w: 3.0, h: 1.6 }, { w: 2.4, h: 1.9 },
	{ w: 1.7, h: 2.5 }, { w: 2.6, h: 1.3 }, { w: 1.9, h: 2.8 },
	{ w: 3.1, h: 1.7 }, { w: 2.3, h: 2.1 }, { w: 1.6, h: 2.9 },
];

const fadeUp = {
	hidden: { opacity: 0, y: 30 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, delay, ease: "easeOut" as const },
	}),
};

export default function HeroSection() {
	const [avatarCount, setAvatarCount] = useState<number | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		fetch("/api/posts?page=1", { signal: controller.signal })
			.then((r) => r.json())
			.then((data) => {
				if (data.success && typeof data.totalPosts === "number") {
					setAvatarCount(data.totalPosts);
				}
			})
			.catch(() => {});
		return () => controller.abort();
	}, []);

	return (
		/* Reduced pt-24 to pt-12 to pull the whole section up */
		<section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-transparent px-3 sm:px-4 pt-8 sm:pt-12 pb-10 sm:pb-16">

			{/* ─── Mesh Gradient Background ─── */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-transparent"
			>
				{/* Adjusted top positions from -20% to -25% to account for reduced section padding */}
				<div className="absolute -top-[25%] -right-[10%] w-[250px] sm:w-150 md:w-200 h-[250px] sm:h-150 md:h-200 rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />
				<div className="absolute -bottom-[20%] -left-[10%] w-[250px] sm:w-150 md:w-200 h-[250px] sm:h-150 md:h-200 rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />
				<div className="absolute top-[5%] left-[20%] w-[200px] sm:w-125 h-[200px] sm:h-125 rounded-full bg-[#9D00FF]/30 blur-[100px] sm:blur-[140px]" />
				<div className="absolute bottom-[20%] right-[20%] w-[200px] sm:w-125 h-[200px] sm:h-125 rounded-full bg-[#6A00F4]/30 blur-[100px] sm:blur-[140px]" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-100 h-[150px] sm:h-100 rounded-full bg-yellow-500/10 blur-[80px] sm:blur-[100px]" />
				<div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
			</div>

			{/* Decorative star particles */}
			{STAR_SIZES.map((p, i) => (
				<span
					key={i}
					aria-hidden
					className="pointer-events-none absolute rounded-full bg-yellow-300/40"
					style={{
						width: `${p.w}px`,
						height: `${p.h}px`,
						top: `${10 + ((i * 73) % 80)}%`,
						left: `${5 + ((i * 59) % 90)}%`,
						boxShadow: "0 0 8px rgba(253, 224, 71, 0.6)",
					}}
				/>
			))}

			{/* Layout Grid */}
			<div className="relative z-10 flex items-center md:items-end justify-center gap-2 sm:gap-4 md:gap-12 w-full max-w-7xl mx-auto min-h-[400px] sm:min-h-[500px] md:min-h-150 mt-2 sm:mt-4 md:mt-0">

				{/* Left Avatar (Male) */}
				<motion.div
					variants={floatVariants}
					animate="animate"
					className="absolute -left-2 sm:-left-2 top-1/2 -translate-y-1/2 md:relative md:left-auto md:top-auto md:translate-y-0 shrink-0 group z-0 md:z-10 opacity-20 sm:opacity-30 md:opacity-100 pointer-events-none md:pointer-events-auto"
				>
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-37.5 md:w-55 h-100 bg-yellow-500/20 blur-[80px] rounded-full -z-10 transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
					<div className="relative w-32 h-60 sm:w-45 sm:h-85 md:w-87.5 md:h-170 mask-[linear-gradient(to_bottom,black_50%,transparent_100%)]">
						<Image
							src="/avatar-4.png"
							alt="Male Avatar"
							fill
							className="object-contain md:object-top drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
							priority
						/>
					</div>
				</motion.div>

				{/* Center Content */}
				{/* Reduced md:pb-24 to md:pb-12 to pull content upward */}
				<div className="relative flex flex-col items-center text-center gap-4 sm:gap-6 md:gap-7 flex-1 max-w-2xl px-1 sm:px-4 z-20 md:pb-12 mt-2 sm:mt-4 md:mt-0">

					<motion.div custom={0.25} initial="hidden" animate="visible" variants={fadeUp} className="w-full flex justify-center py-2 sm:py-4">
						<div className="relative w-48 sm:w-72 md:w-80 lg:w-96 h-36 sm:h-56 md:h-64 lg:h-72">
							<Image
								src="/Avrudu-logo.png"
								alt="AI Avurudu with Zellers Chocolates"
								fill
								className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
								priority
							/>
						</div>
					</motion.div>

					<motion.p custom={0.4} initial="hidden" animate="visible" variants={fadeUp} className="text-sm sm:text-base md:text-xl text-blue-50/90 leading-relaxed max-w-lg font-light drop-shadow-md px-2 sm:px-4 md:px-0">
						Introducing Sri Lanka’s First Ever AI Avurudu Kumara & Kumariya Contest{" "}
						<span className="text-white font-medium">
							Powered by Zellers

						</span>
					</motion.p>

					<motion.div custom={0.55} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center mt-2 sm:mt-4 w-full justify-center px-2 sm:px-4 md:px-0">
						<Link
							href="/winners"
							className="group relative overflow-hidden w-full sm:w-auto text-xs sm:text-sm font-extrabold tracking-widest text-black bg-linear-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full px-5 sm:px-8 py-3 sm:py-4 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_30px_rgba(234,179,8,0.6)] whitespace-nowrap inline-flex items-center justify-center"
						>
							<span className="relative z-10 flex flex-row items-center justify-center gap-2 drop-shadow-sm">
								<span className="text-xl leading-none font-medium pb-0.5">🏆</span>
								<span>VIEW WINNERS</span>
							</span>
							<span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full ease-out" />
						</Link>
						<Link
							href="/vote"
							className="w-full sm:w-auto text-xs sm:text-sm font-bold tracking-widest text-white border-2 border-white/30 bg-white/10 rounded-full px-5 sm:px-8 py-3 sm:py-4 hover:bg-white/20 hover:border-white/50 transition-all duration-300 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.1)] whitespace-nowrap inline-flex items-center justify-center"
						>
							VIEW GALLERY →
						</Link>
					</motion.div>

					<motion.div custom={0.7} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-4 w-full">
						<div className="flex items-center gap-2">
							<span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-green-500"></span>
							</span>
							<span className="text-blue-100 font-medium drop-shadow-sm">
							{avatarCount !== null ? `${avatarCount.toLocaleString()} AVATARS CREATED` : "AVATARS CREATED"}
						</span>
						</div>
						<span className="hidden sm:inline text-white/30">|</span>
						<span className="text-yellow-400 font-bold drop-shadow-sm w-full sm:w-auto mt-1 sm:mt-0"></span>
					</motion.div>
				</div>

				{/* Right Avatar (Female) */}
				<motion.div
					variants={floatVariants}
					animate="animate"
					style={{ animationDelay: "1.5s" }}
					className="absolute -right-2 sm:-right-2 top-1/2 -translate-y-1/2 md:relative md:right-auto md:top-auto md:translate-y-0 shrink-0 group z-0 md:z-10 opacity-20 sm:opacity-30 md:opacity-100 pointer-events-none md:pointer-events-auto"
				>
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-37.5 md:w-55 h-100 bg-purple-600/30 blur-[80px] rounded-full -z-10 transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
					<div className="relative w-32 h-60 sm:w-45 sm:h-85 md:w-87.5 md:h-170 mask-[linear-gradient(to_bottom,black_50%,transparent_100%)]">
						<Image
							src="/avatar-3.png"
							alt="Female Avatar"
							fill
							className="object-contain md:object-top drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
							priority
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
}