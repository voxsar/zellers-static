"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, Send, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Link from "next/link";

const CONTACT_INFO = [
	{ icon: MapPin, label: "Address", value: "House of Maliban, 389, Galle Road, Ratmalana, Sri Lanka", href: "https://maps.google.com/?q=389+Galle+Road+Ratmalana+Sri+Lanka" },
	{ icon: Phone, label: "Customer Care", value: "1383", href: "tel:1383" },
	{ icon: Mail, label: "Email", value: "cic@malibangroup.lk", href: "mailto:cic@malibangroup.lk" },
	{ icon: Globe, label: "Website", value: "www.malibangroup.lk", href: "https://www.malibangroup.lk" },
];

export default function ContactPage() {
	const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);

	const isComplete = Object.values(form).every((v) => v.trim() !== "");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isComplete) return;
		setLoading(true);
		setTimeout(() => { setLoading(false); setSent(true); }, 1400);
	}

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

			<main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 pt-24 sm:pt-32 pb-16 sm:pb-24">

				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" as const }}
					className="text-center mb-10 sm:mb-14"
				>
					<p className="text-[10px] font-bold tracking-[0.35em] uppercase text-yellow-400/60 mb-3">
						GET IN TOUCH
					</p>
					<h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-gray-100 tracking-tight">
						Contact <span className="text-yellow-400">Us</span>
					</h1>
					<p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto">
						Have a question or need help? We typically respond within one business day.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-5 gap-8">

					{/* Contact info */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" as const }}
						className="md:col-span-2 flex flex-col gap-4"
					>
						{CONTACT_INFO.map((c, i) => (
							<motion.a
								key={c.label}
								href={c.href}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: "easeOut" as const }}
								className="flex items-start gap-4 bg-[#1a0f4e] border border-purple-400/20 rounded-2xl px-5 py-4 hover:border-yellow-500/40 transition-colors duration-200 group"
							>
								<div className="mt-0.5 w-8 h-8 rounded-full bg-yellow-500/15 flex items-center justify-center shrink-0">
									<c.icon size={15} className="text-yellow-400" />
								</div>
								<div>
									<p className="text-[9px] font-bold tracking-[0.25em] uppercase text-gray-500 mb-0.5">{c.label}</p>
									<p className="text-sm text-gray-300 group-hover:text-yellow-400 transition-colors duration-200">{c.value}</p>
								</div>
							</motion.a>
						))}

						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" as const }}
							className="bg-[#1a0f4e] border border-purple-400/20 rounded-2xl px-5 py-4 mt-2"
						>
							<p className="text-[9px] font-bold tracking-[0.25em] uppercase text-gray-500 mb-2">OFFICE HOURS</p>
							<p className="text-sm text-gray-300">Monday – Friday</p>
							<p className="text-sm text-yellow-400 font-semibold">9:00 AM – 5:30 PM SLST</p>
						</motion.div>
					</motion.div>

					{/* Contact form */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" as const }}
						className="md:col-span-3"
					>
						{sent ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="h-full flex flex-col items-center justify-center gap-5 bg-[#1a0f4e] border border-purple-400/20 rounded-2xl px-8 py-16 text-center"
							>
								<CheckCircle2 size={52} className="text-yellow-400" strokeWidth={1.5} />
								<div>
									<p className="text-xl font-black text-gray-100 mb-1">Message Sent!</p>
									<p className="text-sm text-gray-400">We'll get back to you within one business day.</p>
								</div>
								<button
									onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setSent(false); }}
									className="text-xs font-bold text-yellow-400 border border-yellow-500/40 rounded-full px-6 py-2 hover:bg-yellow-500/10 transition-all duration-200"
								>
									SEND ANOTHER MESSAGE
								</button>
							</motion.div>
						) : (
							<form
								onSubmit={handleSubmit}
								className="bg-[#1a0f4e] border border-purple-400/20 rounded-2xl px-6 md:px-8 py-8 space-y-5"
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
									<div className="space-y-1.5">
										<label className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">Name</label>
										<input
											type="text"
											value={form.name}
											onChange={(e) => setForm({ ...form, name: e.target.value })}
											placeholder="Shashith Perera"
											className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500/60 focus:bg-white/12 transition-all"
										/>
									</div>
									<div className="space-y-1.5">
										<label className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">Email</label>
										<input
											type="email"
											value={form.email}
											onChange={(e) => setForm({ ...form, email: e.target.value })}
											placeholder="shashith@gmail.com"
											className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500/60 focus:bg-white/12 transition-all"
										/>
									</div>
								</div>

								<div className="space-y-1.5">
									<label className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">Subject</label>
									<input
										type="text"
										value={form.subject}
										onChange={(e) => setForm({ ...form, subject: e.target.value })}
										placeholder="How can we help?"
										className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500/60 focus:bg-white/12 transition-all"
									/>
								</div>

								<div className="space-y-1.5">
									<label className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">Message</label>
									<textarea
										value={form.message}
										onChange={(e) => setForm({ ...form, message: e.target.value })}
										placeholder="Tell us more…"
										rows={5}
										className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-yellow-500/60 focus:bg-white/12 transition-all resize-none"
									/>
								</div>

								<button
									type="submit"
									disabled={!isComplete || loading}
									className="w-full bg-linear-to-r from-yellow-500 to-amber-400 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:brightness-110 hover:scale-[1.01] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
								>
									{loading ? "SENDING…" : <><Send size={16} strokeWidth={2.5} /> SEND MESSAGE</>}
								</button>
							</form>
						)}
					</motion.div>
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
							<li><Link href="/privacy" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">PRIVACY</Link></li>
							<li><span className="text-white/20 text-xs">·</span></li>
							<li><Link href="/faq" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">FAQ</Link></li>
							<li><span className="text-white/20 text-xs">·</span></li>
							<li><Link href="/contact" className="text-[11px] font-bold tracking-widest text-yellow-400/80 hover:text-yellow-400 transition-colors duration-200">CONTACT</Link></li>
						</ul>
					</nav>
					<p className="text-[10px] text-gray-600 tracking-wide">© 2026 Zellers Chocolates. All rights reserved.</p>
				</motion.div>
			</main>
		</div>
	);
}
