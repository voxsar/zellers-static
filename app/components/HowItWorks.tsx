"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Smartphone, Camera, Star, Sparkles, Trophy } from "lucide-react";

const steps = [
	{
		icon: Smartphone,
		step: "01",
		title: "Register First",
		subtitle: "ලියාපදිංචි වන්න",
		text: "Enter your details and verify with an OTP.",
	},
	{
		icon: Camera,
		step: "02",
		title: "Upload Your image",
		subtitle: "ඔබේ Photo එකක් Upload කරන්න ",
		text: "Upload a clear front-facing photo.",
	},
	{
		icon: Star,
		step: "03",
		title: "Complete the Avurudu Quiz",
		subtitle: "අවුරුදු Quiz එක Complete කරන්න",
		text: "Find your favorite Zellers chocolate flavor.",
	},
	{
		icon: Sparkles,
		step: "04",
		title: "Generate Your AI Avurudu Kumara or Kumariya",
		subtitle: "ඔබේ AI අවුරුදු කුමරා හෝ කුමරිය Generate කරන්න",
		text: "View, download, and share your royal avatar!",
	},
	{
		icon: Trophy,
		step: "05",
		title: "Get Votes & Win",
		subtitle: "Votes ලබාගන්න Win කරන්න",
		text: "Vote for your favourite avatar and stand a chance to win amazing Zellers prizes!",
	},
];

const containerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" as const },
	},
};

export default function HowItWorks() {
	const router = useRouter();
	return (
		<section className="relative py-16 sm:py-24 px-3 sm:px-4 overflow-hidden">

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

			{/* Separator line */}
			<div className="relative z-10 max-w-6xl mx-auto">
				<div className="flex items-center gap-4 mb-12 opacity-60">
					<div className="h-px flex-1 bg-linear-to-r from-transparent to-yellow-500/50" />
					<Sparkles className="w-5 h-5 text-yellow-400" />
					<div className="h-px flex-1 bg-linear-to-l from-transparent to-yellow-500/50" />
				</div>

				{/* Section header */}
				<div className="text-center mb-10 sm:mb-16 space-y-3">
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-xs font-bold tracking-[0.4em] uppercase text-yellow-400 drop-shadow-md"
					>
						THE JOURNEY
					</motion.p>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-gray-100 tracking-tight leading-tight"
					>
						How to create your AI අවුරුදු කුමරා හෝ කුමරිය
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="text-base sm:text-lg text-blue-200/60 font-medium"
					>
						ඔබේ AI අවුරුදු කුමරා හෝ කුමරිය නිර්මාණය කරගන්නේ කෙසේද?
					</motion.p>
				</div>

				{/* Cards Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5"
				>
					{steps.map((step, index) => (
						<motion.div
							key={step.step}
							variants={cardVariants}
							onClick={() => index === 0 && router.push("/campaign")}
							className={`group relative flex flex-col gap-4 sm:gap-6 bg-white/3 border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white/6 hover:border-yellow-500/30 transition-all duration-500 ${index === 0 ? "cursor-pointer" : "cursor-default"} overflow-hidden shadow-xl`}
						>
							{/* Card glow on hover */}
							<div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-yellow-500/5 to-transparent pointer-events-none" />

							{/* Icon & Step number */}
							<div className="flex items-center justify-between relative z-10">
								{/* UPGRADED: Transparent Premium Icon Wrapper */}
								<div className="flex items-center justify-center w-14 h-14 rounded-full bg-transparent backdrop-blur-md border border-white/10 text-yellow-400 group-hover:scale-110 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] group-hover:bg-yellow-500/10 transition-all duration-500">
									<step.icon strokeWidth={1.5} className="w-6 h-6 drop-shadow-md" />
								</div>

								{/* Massive subtle number */}
								<span className="text-6xl font-black text-white/5 group-hover:text-yellow-500/10 transition-colors duration-500 leading-none select-none tracking-tighter">
									{step.step}
								</span>
							</div>

							{/* Connector line (Desktop only) */}
							{index < steps.length - 1 && (
								<div
									aria-hidden
									className="hidden lg:block absolute top-14 -right-3 w-6 h-px bg-linear-to-r from-yellow-500/30 to-transparent z-20"
								/>
							)}

							{/* Content */}
							<div className="space-y-2 relative z-10 mt-2">
								<p className="text-xl font-bold text-gray-100 leading-snug group-hover:text-yellow-300 transition-colors duration-300">
									{step.title}
								</p>
								<p className="text-xs font-bold tracking-widest uppercase text-yellow-500/80">
									{step.subtitle}
								</p>
							</div>

							<p className="text-sm text-gray-400/90 leading-relaxed relative z-10">
								{step.text}
							</p>

							{/* Bottom accent bar that grows on hover */}
							<div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-linear-to-r from-yellow-500 to-amber-300 transition-all duration-700 ease-out" />
						</motion.div>
					))}
				</motion.div>

				{/* Bottom divider */}
				<div className="flex items-center gap-4 mt-20 opacity-40">
					<div className="h-px flex-1 bg-linear-to-r from-transparent to-white/20" />
					<Sparkles className="w-4 h-4 text-white/40" />
					<div className="h-px flex-1 bg-linear-to-l from-transparent to-white/20" />
				</div>
			</div>
		</section>
	);
}