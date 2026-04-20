"use client";

import { motion } from "framer-motion";
import { Trophy, Crown, Sparkles } from "lucide-react";

const grandPrizes = [
	{
		id: "kumariya",
		place: "PEOPLE'S CHOICE",
		icon: Crown,
		title: "Most Popular Avurudu Kumariya",
		sinhala: "ජනප්‍රියතම AI අවුරුදු කුමරිය",
		amount: "Win Rs. 75,000",
		accent: "from-yellow-300 via-yellow-400 to-amber-500",
		glow: "rgba(250, 204, 21, 0.15)",
		delay: 0.1,
	},
	{
		id: "kumara",
		place: "PEOPLE'S CHOICE",
		icon: Trophy,
		title: "Most Popular Avurudu Kumara",
		sinhala: "ජනප්‍රියතම AI අවුරුදු කුමරා",
		amount: "Win Rs. 75,000",
		accent: "from-amber-300 via-amber-500 to-orange-500",
		glow: "rgba(245, 158, 11, 0.15)",
		delay: 0.3,
	},
];

export default function AvuruduPrizes() {
	return (
		<section className="relative py-16 sm:py-24 md:py-32 px-3 sm:px-4 overflow-hidden">

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

			<div className="relative z-10 max-w-5xl mx-auto">

				{/* ── Elegant Header ── */}
				<div className="text-center mb-12 sm:mb-16 md:mb-24 space-y-4">
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="flex items-center justify-center gap-4"
					>
						<div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500/60" />
						<span className="text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
							The Grand Celebration
						</span>
						<div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500/60" />
					</motion.div>

					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-normal text-white tracking-tight drop-shadow-lg"
					>
						Avurudu<span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600 drop-shadow-[0_4px_15px_rgba(234,179,8,0.3)]"> Prizes</span>
					</motion.h2>
				</div>

				{/* ── Premium Golden Cards ── */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center justify-center px-0 sm:px-8">
					{grandPrizes.map((prize) => (
						<motion.div
							key={prize.id}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: prize.delay, ease: [0.22, 1, 0.36, 1] }}
							className="relative group"
						>
							{/* Outer Golden Aura (Activates on Hover smoothly) */}
							<div
								className="absolute inset-0 blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out rounded-[2.5rem]"
								style={{ backgroundColor: prize.glow }}
							/>

							{/* UPGRADED: Frosted Glassmorphism Card Container to match other sections */}
							<div className="relative h-full overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 group-hover:border-yellow-400/50 rounded-[2rem] p-5 sm:p-8 md:p-12 text-center transition-all duration-700 ease-out hover:-translate-y-3 shadow-[0_15px_40px_rgba(0,0,0,0.4)] group-hover:shadow-[0_30px_60px_rgba(234,179,8,0.2)]">

								{/* Premium Inner Border Line */}
								<div className="absolute inset-2 rounded-[1.75rem] border border-white/5 pointer-events-none" />

								{/* Top subtle shine reflection */}
								<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

								{/* Floating Icon with Golden Glow */}
								<div className="relative flex justify-center mb-5 sm:mb-8 mt-2">
									<div className="absolute inset-0 bg-yellow-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
									<div className="relative w-18 h-18 sm:w-24 sm:h-24 bg-gradient-to-b from-yellow-400/10 to-transparent border border-yellow-500/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-[inset_0_0_20px_rgba(234,179,8,0.15)] rotate-3 group-hover:rotate-0">
										<prize.icon className="w-9 h-9 sm:w-12 sm:h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" strokeWidth={1.5} />
									</div>
								</div>

								{/* Tagline */}
								<div className="flex items-center justify-center gap-3 mb-5">
									<Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:animate-spin-slow" />
									<span className="text-[10px] font-black tracking-[0.35em] uppercase text-amber-400">
										{prize.place}
									</span>
									<Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:animate-spin-slow" />
								</div>

								{/* Title */}
								<div className="mb-6 sm:mb-10 min-h-[3rem] sm:min-h-[4rem] flex flex-col items-center justify-center gap-1.5">
									<h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-normal text-gray-100 leading-tight tracking-tight group-hover:text-white transition-colors duration-500 drop-shadow-sm">
										{prize.title}
									</h3>
									<p className="text-sm font-semibold text-yellow-400/80 group-hover:text-yellow-400 transition-colors duration-500 drop-shadow-sm">
										{prize.sinhala}
									</p>
								</div>

								{/* Amount Display */}
								<div className="py-5 sm:py-8 relative group/amount">
									{/* Subtle separator lines */}
									<div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 group-hover:via-yellow-400/60 to-transparent transition-all duration-500" />
									<div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 group-hover:via-yellow-400/60 to-transparent transition-all duration-500" />

									<div className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase mb-3 group-hover:text-yellow-500/80 transition-colors duration-500">
										Grand Prize Value
									</div>

									<div className={`relative inline-block`}>
										{/* The amount text */}
										<span className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${prize.accent} drop-shadow-[0_2px_15px_rgba(234,179,8,0.3)] group-hover:drop-shadow-[0_5px_25px_rgba(234,179,8,0.6)] transition-all duration-700 block transform group-hover:scale-105`}>
											{prize.amount}
										</span>
										{/* Shimmer effect overlay */}
										<motion.span
											className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 mix-blend-overlay pointer-events-none"
											animate={{ x: ["-100%", "200%"], opacity: [0, 0.4, 0] }}
											transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
										/>
									</div>
								</div>

							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}