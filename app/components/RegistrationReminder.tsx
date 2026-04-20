"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegistrationReminder() {
	const [visible, setVisible] = useState(false);

	// We use a ref to remember if they closed it during THIS specific page view.
	// When the page refreshes, this resets to false automatically.
	const hasDismissed = useRef(false);

	useEffect(() => {
		// Start a 12-second timer exactly once when the page loads/refreshes.
		const timer = setTimeout(() => {
			// Only show it if they haven't already dismissed it before the 12 seconds hit
			if (!hasDismissed.current) {
				setVisible(true);
			}
		}, 12000);

		// Cleanup the timer if the component unmounts
		return () => clearTimeout(timer);
	}, []);

	function handleClose() {
		setVisible(false);
		hasDismissed.current = true; // Mark as dismissed for this page load
	}

	return (
		<AnimatePresence>
			{visible && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

					{/* ─── BLURRY BACKDROP ─── */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
						className="absolute inset-0 bg-[#0A0515]/70 backdrop-blur-md"
						onClick={handleClose} // Closes when clicking the background
					/>

					{/* ─── MODAL CARD ─── */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-md bg-[#160A30] border border-yellow-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10"
						style={{
							backgroundImage: 'url(/people.png)',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat'
						}}
					>
						{/* Dark Overlay */}
						<div className="absolute inset-0 bg-[#160A30]/90 rounded-3xl z-0" />

						{/* Close Button */}
						<button
							onClick={handleClose}
							aria-label="Dismiss"
							className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white/60 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-all duration-200"
						>
							<X size={18} />
						</button>

						{/* ─── IMAGE SECTION WITH SEAMLESS FADE ─── */}
						<div className="relative w-full h-48 sm:h-56 z-20">
							{/* Note: Update this src to your actual promotional image */}
							<Image
								src="/loading.jpeg"
								alt=""
								fill
								className="object-cover opacity-80"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#160A30] via-[#160A30]/40 to-transparent" />
						</div>

						{/* ─── CONTENT SECTION ─── */}
						<div className="relative px-4 sm:px-8 pb-6 sm:pb-8 pt-2 text-center z-20">

							{/* Floating Crown Badge */}
							<div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)] -mt-14 mb-4 border-4 border-[#160A30]">
								<Crown size={28} className="text-[#160A30] drop-shadow-sm" />
							</div>

							{/* Text Content */}
							<h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight mb-2">
								Create now
							</h3>
							<p className="text-sm text-blue-200/70 leading-relaxed max-w-[280px] mx-auto">
								Are you the Zellers AI අවුරුදු කුමරා or කුමරිය? <br />
								Zellers AI අවුරුදු කුමරා කුමරිය ඔබද?
								<span className="text-yellow-400 font-bold block mt-1 text-lg">Win Rs. 75,000</span>
							</p>

							{/* Call to Action Button */}
							<Link
								href="/campaign"
								onClick={handleClose} // Closes modal when navigating away
								className="mt-8 flex items-center justify-center w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-[#160A30] text-sm font-black tracking-widest uppercase rounded-xl py-4 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
							>
								Create now
							</Link>

							<p className="text-sm text-blue-200/70 leading-relaxed max-w-[280px] mx-auto">
								Create your AI Avatar based on your own look
								and stand a chance to win LKR 75,000!<br /><br />

								ඔයාගේ පෙනුම AI Avatar එකක් විදියට Create කරලා,රුපියල් 75,000ක් දිනාගන්න.
								<span className="text-yellow-400 font-bold block mt-1 text-lg">Win Rs. 75,000</span>
							</p>


							{/* Secondary Dismiss Action */}
							<button
								onClick={handleClose}
								className="mt-4 text-[11px] font-bold tracking-widest text-white/30 hover:text-white/60 uppercase transition-colors"
							>
								Maybe Later
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}