"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Link from "next/link";

const FAQS = [
	{
		q: "What is the Zellers AI Avurudu?",
		a: "It's a free-to-enter competition where you upload a selfie, answer a short quiz, and our AI transforms you into a legendary Avurudu Kumara or Kumariya avatar. Top voted avatars win exciting prizes from Zellers Chocolates.",
	},
	{
		q: "Who can enter the campaign?",
		a: "The campaign is open to all Sri Lankan residents aged 18 and above. ",
	},
	{
		q: "How do I create my avatar?",
		a: "Go to the Campaign page, verify your mobile number with OTP, fill in your profile, answer 3 quick questions about your Avurudu preferences, then upload a clear front-facing selfie. Our AI will generate your AI avatar.",
	},
	{
		q: "Is it free to enter?",
		a: "Yes, entering the campaign is completely free. No purchase is necessary.",
	},
	{
		q: "How does voting work?",
		a: "Every verified participant can cast one vote on the Vote page. You can vote for any avatar in the gallery. Votes reset at midnight SLST each day.",
	},
	{
		q: "When does the campaign end?",
		a: "The campaign closes on April 22, 2026 at 23:59 SLST. Winners will be announced on April 23, 2026.",
	},


	{
		q: "Can I delete my avatar after submitting?",
		a: "Yes. Contact us at support@zellers.lk with your registered mobile number and we will remove your entry and avatar from the platform within 48 hours.",
	},

];

function FAQItem({ item, index }: { item: typeof FAQS[0]; index: number }) {
	const [open, setOpen] = useState(false);
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" as const }}
			className="bg-purple-950/30 border border-purple-500/15 rounded-2xl overflow-hidden backdrop-blur-sm"
		>
			<button
				onClick={() => setOpen((o) => !o)}
				className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
			>
				<span className="text-sm font-bold text-gray-100">{item.q}</span>
				<ChevronDown
					size={18}
					className={`shrink-0 text-yellow-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
				/>
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" as const }}
						className="overflow-hidden"
					>
						<p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-purple-500/10 pt-4">
							{item.a}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

export default function FAQPage() {
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

			<main className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 pt-24 sm:pt-32 pb-16 sm:pb-24">

				<motion.div
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" as const }}
					className="text-center mb-10 sm:mb-14"
				>
					<p className="text-[10px] font-bold tracking-[0.35em] uppercase text-yellow-400/60 mb-3">
						HELP
					</p>
					<h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-gray-100 tracking-tight">
						Frequently Asked <span className="text-yellow-400">Questions</span>
					</h1>
					<p className="text-sm text-gray-500 mt-3">Everything you need to know about the AI Avurudu.</p>
				</motion.div>

				<div className="space-y-3">
					{FAQS.map((item, i) => (
						<FAQItem key={item.q} item={item} index={i} />
					))}
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.7 }}
					className="text-center mt-14 flex flex-col items-center gap-4"
				>
					<p className="text-sm text-gray-400">Still have questions?</p>
					<Link
						href="/contact"
						className="text-sm font-extrabold tracking-widest text-black bg-linear-to-r from-yellow-500 to-amber-400 rounded-full px-8 py-3 hover:brightness-110 hover:scale-105 transition-all duration-200"
						style={{ boxShadow: "0 0 16px rgba(234,179,8,0.25)" }}
					>
						CONTACT US
					</Link>
					<Link href="/" className="text-xs font-bold text-gray-600 hover:text-yellow-400 tracking-widest transition-colors duration-200">
						← BACK TO HOME
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.8 }}
					className="mt-10 border-t border-purple-500/15 pt-8 flex flex-col items-center gap-4"
				>
					<nav aria-label="Page footer">
						<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
							<li><Link href="/" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">HOME</Link></li>
							<li><span className="text-white/20 text-xs">·</span></li>
							<li><Link href="/terms" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">TERMS</Link></li>
							<li><span className="text-white/20 text-xs">·</span></li>
							<li><Link href="/privacy" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">PRIVACY</Link></li>
							<li><span className="text-white/20 text-xs">·</span></li>
							<li><Link href="/faq" className="text-[11px] font-bold tracking-widest text-yellow-400/80 hover:text-yellow-400 transition-colors duration-200">FAQ</Link></li>
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
