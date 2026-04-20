"use client";

import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Link from "next/link";

const SECTIONS = [
	{
		title: "Information We Collect",
		body: "We collect your mobile number (for OTP verification), name, and gender when you enter the campaign. We also collect the selfie photo you upload and the AI-generated avatar image.",
	},
	{
		title: "How We Use Your Information",
		body: "Your information is used to verify your identity, generate your AI avatar, administer the campaign, contact winners, and for promotional purposes with your consent. We do not sell your personal data to third parties.",
	},

	{
		title: "Avatar & Image Rights",
		body: "Your uploaded selfie is used solely to generate your AI avatar. Generated avatars may be used by Zellers Chocolates for promotional purposes as described in our Terms & Conditions.",
	},
	{
		title: "Cookies",
		body: "Our website uses essential cookies to function correctly (e.g. session management). We do not use tracking or advertising cookies without your explicit consent.",
	},
	{
		title: "Third-Party Services",
		body: "We use trusted third-party services for AI image generation. These providers are bound by strict data processing agreements and may not use your data for any purpose other than delivering the service.",
	},

	{
		title: "Contact",
		body: "For privacy-related inquiries, please contact our Data Protection Officer at privacy@zellers.lk or write to us at Zellers Chocolates (Pvt) Ltd, Colombo, Sri Lanka.",
	},
];

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-transparent flex flex-col">
			<Navbar />

			{/* Ambient blobs — hero palette */}
			<div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
				<div className="absolute -top-[10%] -right-[5%] w-[250px] sm:w-150 h-[250px] sm:h-150 rounded-full bg-[#00E5FF]/12 blur-[100px] sm:blur-[150px]" />
				<div className="absolute -bottom-[10%] -left-[5%] w-[250px] sm:w-150 h-[250px] sm:h-150 rounded-full bg-[#00E5FF]/12 blur-[100px] sm:blur-[150px]" />
				<div className="absolute top-[15%] left-[20%] w-[200px] sm:w-125 h-[200px] sm:h-125 rounded-full bg-[#9D00FF]/10 blur-[100px] sm:blur-[140px]" />
				<div className="absolute bottom-[20%] right-[20%] w-[200px] sm:w-125 h-[200px] sm:h-125 rounded-full bg-[#6A00F4]/10 blur-[100px] sm:blur-[140px]" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-100 h-[150px] sm:h-100 rounded-full bg-yellow-500/6 blur-[80px] sm:blur-[100px]" />
			</div>

			<main className="flex-1 max-w-3xl mx-auto w-full px-3 sm:px-4 pt-24 sm:pt-32 pb-16 sm:pb-24">

				<motion.div
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" as const }}
					className="text-center mb-10 sm:mb-14"
				>
					<p className="text-[10px] font-bold tracking-[0.35em] uppercase text-yellow-400/60 mb-3">
						LEGAL
					</p>
					<h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-gray-100 tracking-tight">
						Privacy <span className="text-yellow-400">Policy</span>
					</h1>
					<p className="text-sm text-gray-500 mt-3">Last updated: April 1, 2026</p>
				</motion.div>

				<div className="space-y-6">
					{SECTIONS.map((s, i) => (
						<motion.div
							key={s.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" as const }}
							className="bg-purple-950/30 border border-purple-500/15 rounded-2xl px-6 py-5 backdrop-blur-sm"
						>
							<h2 className="font-playfair text-sm font-normal text-yellow-400 tracking-wide mb-2">{s.title}</h2>
							<p className="text-sm text-gray-400 leading-relaxed">{s.body}</p>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="mt-16 border-t border-purple-500/15 pt-8 flex flex-col items-center gap-4"
				>
					<nav aria-label="Page footer">
						<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
							<li><Link href="/" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">HOME</Link></li>
							<li><span className="text-white/20 text-xs">·</span></li>
							<li><Link href="/terms" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">TERMS</Link></li>
							<li><span className="text-white/20 text-xs">·</span></li>
							<li><Link href="/privacy" className="text-[11px] font-bold tracking-widest text-yellow-400/80 hover:text-yellow-400 transition-colors duration-200">PRIVACY</Link></li>
							<li><span className="text-white/20 text-xs">·</span></li>
							<li><Link href="/faq" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">FAQ</Link></li>
							<li><span className="text-white/20 text-xs">·</span></li>
							<li><Link href="/contact" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">CONTACT</Link></li>
						</ul>
					</nav>
					<p className="text-[10px] text-gray-600 tracking-wide">© 2026 Zellers Chocolates. All rights reserved.</p>
				</motion.div>
			</main>
		</div>
	);
}
