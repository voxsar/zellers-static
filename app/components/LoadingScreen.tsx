"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
	"සුබ අලුත් අවුරුද්දක් වේවා!\u2026",
	"Summoning your royal avatar\u2026",
	"Almost ready\u2026",
];

export default function LoadingScreen() {
	const [isVisible, setIsVisible] = useState(true);
	const [progress, setProgress] = useState(0);
	const [msgIndex, setMsgIndex] = useState(0);
	const rafRef = useRef<number | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		if (sessionStorage.getItem("zellers_loaded")) {
			setIsVisible(false);
			return;
		}

		const DURATION = 2800;
		const start = performance.now();

		const tick = (now: number) => {
			const elapsed = now - start;
			const raw = Math.min(elapsed / DURATION, 1);
			const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
			const p = Math.round(eased * 100);

			setProgress(p);
			if (p >= 68) setMsgIndex(1);
			if (p >= 94) setMsgIndex(2);

			if (raw < 1) {
				rafRef.current = requestAnimationFrame(tick);
			} else {
				setTimeout(() => {
					sessionStorage.setItem("zellers_loaded", "1");
					setIsVisible(false);
				}, 520);
			}
		};

		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	if (!isMounted) return null;

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					key="loading-screen"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.8, ease: "easeInOut" }}
					className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0A0515]"
				>
					{/* ── MOBILE BACKGROUND: Original Portrait Image ── */}
					<div className="md:hidden absolute inset-0">
						<Image
							src="/loading.jpeg"
							alt=""
							fill
							className="object-cover opacity-80"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-b from-[#0A0515]/60 via-transparent to-[#0A0515]" />
					</div>

					{/* ── WEB BACKGROUND: Cinematic Mesh Gradient (No Portrait Image) ── */}
					<div className="hidden md:block absolute inset-0 bg-[#1E0B4B] overflow-hidden">
						{/* Mesh Glows */}
						<div className="absolute -top-[10%] -right-[5%] w-[60vw] h-[60vw] rounded-full bg-[#00E5FF]/20 blur-[140px]" />
						<div className="absolute -bottom-[10%] -left-[5%] w-[50vw] h-[50vw] rounded-full bg-[#9D00FF]/20 blur-[140px]" />
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-[#00E5FF]/10 blur-[120px]" />

						{/* Mandala Patterns (Subtle texture for depth) */}
						<div className="absolute -top-20 -left-20 w-96 h-96 opacity-[0.05] invert rotate-12">
							<Image src="/loading.jpeg" alt="" fill className="object-contain blur-[2px]" />
						</div>
						<div className="absolute -bottom-20 -right-20 w-96 h-96 opacity-[0.05] invert -rotate-12">
							<Image src="/loading.jpeg" alt="" fill className="object-contain blur-[2px]" />
						</div>

						<div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
					</div>

					{/* ── CENTRAL CONTENT ── */}
					<div className="relative z-20 flex flex-col items-center w-full h-full justify-center">

						{/* Top Badge (HIDDEN ON MOBILE) */}
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="hidden md:block mb-8 px-5 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/5 backdrop-blur-md"
						>
							<span className="text-[10px] font-black tracking-[0.4em] uppercase text-yellow-400">
								✦ Avurudu 2026 ✦
							</span>
						</motion.div>

						{/* Logo: Refined and Pulsing (HIDDEN ON MOBILE) */}
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: [0.9, 1, 0.95], opacity: 1 }}
							transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
							className="hidden md:block relative w-48 h-32 md:w-64 md:h-40 mb-10"
						>
							<Image
								src="/Avrudu-logo.png"
								alt="Logo"
								fill
								className="object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]"
								priority
							/>
						</motion.div>

						{/* Progress UI (Anchored to bottom on mobile so it doesn't block the poster art) */}
						<div className="absolute bottom-12 sm:bottom-16 md:static flex flex-col items-center gap-4 w-52 sm:w-64">
							<AnimatePresence mode="wait">
								<motion.p
									key={msgIndex}
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -5 }}
									className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70 md:text-white/50 text-center drop-shadow-md"
								>
									{MESSAGES[msgIndex]}
								</motion.p>
							</AnimatePresence>

							{/* Minimalist Gold Track */}
							<div className="relative w-full h-[2px] bg-white/20 md:bg-white/10 rounded-full overflow-hidden shadow-sm">
								<motion.div
									className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200"
									style={{ width: `${progress}%` }}
								/>
							</div>

							{/* Percentage */}
							<div className="flex items-baseline gap-1 drop-shadow-md">
								<span className="text-lg font-black text-white tabular-nums">{progress}</span>
								<span className="text-[10px] font-bold text-yellow-500/80">%</span>
							</div>
						</div>
					</div>

					{/* Sparkle Particles (Web Only) */}
					<div className="hidden md:block absolute inset-0 pointer-events-none">
						{[...Array(15)].map((_, i) => (
							<motion.div
								key={i}
								className="absolute w-1 h-1 bg-yellow-400 rounded-full"
								initial={{
									x: Math.random() * 100 + "vw",
									y: Math.random() * 100 + "vh",
									opacity: 0
								}}
								animate={{
									y: ["0vh", "-10vh"],
									opacity: [0, 1, 0]
								}}
								transition={{
									duration: 2 + Math.random() * 2,
									repeat: Infinity,
									delay: Math.random() * 2
								}}
							/>
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}