"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = [
	{ label: "Terms & Conditions", href: "/terms" },
	{ label: "Privacy Policy", href: "/privacy" },
	{ label: "FAQ", href: "/faq" },
	{ label: "Contact", href: "/contact" },
];

export default function Footer() {
	return (
		<footer className="relative bg-transparent border-t border-white/5 overflow-hidden">

			{/* ─── EXPERT UI: Unified Hero Mesh Gradient Background ─── */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-transparent" // Deep violet/indigo base
			>
				{/* Top Right Bright Cyan Glow */}
				<div className="absolute -top-[20%] -right-[10%] w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[600px] md:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />

				{/* Bottom Left Bright Cyan Glow */}
				<div className="absolute -bottom-[20%] -left-[10%] w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[600px] md:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[80px] sm:blur-[120px] md:blur-[160px]" />

				{/* Center/Top-Left Deep Magenta Blend */}
				<div className="absolute top-[10%] left-[20%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[#9D00FF]/30 blur-[100px] sm:blur-[140px]" />

				{/* Center/Bottom-Right Deep Purple Blend */}
				<div className="absolute bottom-[20%] right-[20%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[#6A00F4]/30 blur-[100px] sm:blur-[140px]" />

				{/* Subtle Central Golden ambient glow */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-yellow-500/10 blur-[80px] sm:blur-[100px]" />

				{/* Grain overlay for cinematic film feel */}
				<div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
			</div>

			{/* ── Final CTA Block ── */}
			<div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 pt-16 sm:pt-24 pb-14 sm:pb-20 flex flex-col items-center text-center gap-5 sm:gap-8">
				{/* Small label */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-xs font-bold tracking-[0.4em] uppercase text-yellow-400 drop-shadow-md"
				>
					YOUR MOMENT AWAITS
				</motion.p>

				{/* Big headline */}
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" as const }}
					className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-gray-100 leading-tight tracking-tight"
				>
					READY TO BECOME AN{" "}
					<span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">AI</span>{" "}
					<span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
						අවුරුදු කුමරා / කුමරිය?
					</span>
				</motion.h2>

				{/* Subtitle */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.25 }}
					className="text-base sm:text-lg text-blue-50/90 max-w-xl leading-relaxed drop-shadow-md"
				>
					Upload your selfie, choose your favorite Zellers flavor, and get your perfect{" "}
					<span className="text-white font-medium">
						AI Avurudu look.
					</span>{" "}
					Results will be announced on April 19th
				</motion.p>

				{/* Pulsing CTA button */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" as const }}
				>
					<a
						href="/winners"
						className="relative text-sm sm:text-base font-extrabold tracking-widest text-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full px-10 py-4 hover:scale-105 transition-transform duration-200 inline-block"
						style={{
							boxShadow: "0 0 20px rgba(234,179,8,0.4), 0 0 50px rgba(234,179,8,0.15)",
						}}
					>
						🏆 SEE WINNERS
					</a>
				</motion.div>

				{/* Supporting note */}
				<motion.p
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.45 }}
					className="text-xs text-white/50 tracking-widest uppercase font-semibold"
				>
					Free to enter · Results announced April 19th, 2026
				</motion.p>
			</div>

			{/* ── Divider ── */}
			<div className="relative z-10 max-w-6xl mx-auto px-4">
				<div className="flex items-center gap-4 opacity-40">
					<div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/30" />
					<span className="text-white/40 text-sm">✦</span>
					<div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/30" />
				</div>
			</div>

			{/* ── Footer Body ── */}
			<div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">

				{/* Image Logo */}
				<div className="flex flex-col items-center sm:items-start">
					<div className="relative w-40 h-20 sm:w-48 sm:h-24">
						<Image
							src="/Avrudu-logo.png"
							alt="AI Avurudu with Zellers Chocolates"
							fill
							className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
							priority
						/>
					</div>
				</div>

				{/* Nav links */}
				<nav aria-label="Footer navigation">
					<ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
						{footerLinks.map((link) => (
							<li key={link.label}>
								<Link
									href={link.href}
									className="text-xs text-blue-100/60 hover:text-yellow-400 transition-colors duration-200 tracking-widest font-semibold uppercase"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			{/* ── Bottom copyright bar ── */}
			<div className="relative z-10 border-t border-white/10 bg-black/20">
				<div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-center">
					<p className="text-xs text-white/40 tracking-widest font-medium text-center uppercase">
						© 2026 Zellers Chocolates. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}