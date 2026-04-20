"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trophy, Clock, XCircle, RefreshCw, Plus, ArrowRight, Download, Copy, Check as CheckIcon } from "lucide-react";
import Image from "next/image";
import { trackFBEvent } from "@/lib/analytics";

// ─── Gender-specific share caption ───────────────────────────────────────────
function getShareCaption(displayName?: string, gender?: string): string {
	const name = displayName || "them";
	if (gender === "female") {
		return `Vote for ${name} to become the First ever අවුරුදු කුමරිය in the AI අවුරුදු With Zellers Contest.\n\nCreate your own AI Avatar and enter the competition:\n👉 aiavuruduwithzellers.com/campaign\n\n#ZellersAvurudu #AIAvatar #Avurudu2026 #Zellers`;
	}
	return `Vote for ${name} to become the First-ever අවුරුදු කුමරා in the AI අවුරුදු With Zellers Contest.\n\nCreate your own AI Avatar and enter the competition:\n👉 aiavuruduwithzellers.com/campaign\n\n#ZellersAvurudu #AIAvatar #Avurudu2026 #Zellers`;
}

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface Generation {
	postId: string;
	postNumber?: number;
	flavor?: string;
	imageUrl: string;
	submitted: boolean;
	approvalStatus: "pending" | "approved" | "rejected";
	attemptCount: number;
	createdAt: string;
	updatedAt: string;
}

interface Props {
	generations: Generation[];
	canStartNewAttempt: boolean;
	onStartNewAttempt: () => void;
	displayName?: string;
	gender?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const FLAVOUR_LABELS: Record<string, string> = {
	pista: "Pistachio & Kunafa",
	red: "Red Velvet",
	coconut: "Coconut Cream",
	cookie_cream: "Cookie Cream",
	mixed_nut: "Mix Nut Cream",
	strawberry: "Strawberry Cream",
};

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

// ─── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ gen }: { gen: Generation }) {
	if (!gen.submitted) {
		return (
			<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-full text-[10px] font-bold text-amber-300 uppercase tracking-wider">
				<span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
				Not Submitted
			</span>
		);
	}
	if (gen.approvalStatus === "approved") {
		return (
			<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded-full text-[10px] font-bold text-green-300 uppercase tracking-wider">
				<CheckCircle2 size={10} />
				Approved!
			</span>
		);
	}
	if (gen.approvalStatus === "rejected") {
		return (
			<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/40 rounded-full text-[10px] font-bold text-red-300 uppercase tracking-wider">
				<XCircle size={10} />
				Rejected
			</span>
		);
	}
	// submitted + pending
	return (
		<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px] font-bold text-blue-300 uppercase tracking-wider">
			<Clock size={10} />
			Under Review
		</span>
	);
}

// ─── Generation Card ────────────────────────────────────────────────────────────
function GenerationCard({ gen, token, onSubmitted, displayName, gender }: { gen: Generation; token: string; onSubmitted: (postId: string) => void; displayName?: string; gender?: string }) {
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [captionCopied, setCaptionCopied] = useState(false);
	const [downloading, setDownloading] = useState(false);

	async function handleSubmit() {
		setError("");
		setSubmitting(true);
		try {
			const res = await fetch("/api/avatar/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
				body: JSON.stringify({ postId: gen.postId }),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.message || "Failed to submit. Please try again.");
				return;
			}
			// Avatar submitted for contest = SubmitApplication
			trackFBEvent("SubmitApplication");
			onSubmitted(gen.postId);
		} catch {
			setError("Network error. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	async function handleCopyCaption() {
		const caption = getShareCaption(displayName, gender);
		try {
			await navigator.clipboard.writeText(caption);
			setCaptionCopied(true);
			setTimeout(() => setCaptionCopied(false), 2500);
		} catch {
			const ta = document.createElement("textarea");
			ta.value = caption;
			ta.style.position = "fixed";
			ta.style.opacity = "0";
			document.body.appendChild(ta);
			ta.focus();
			ta.select();
			document.execCommand("copy");
			document.body.removeChild(ta);
			setCaptionCopied(true);
			setTimeout(() => setCaptionCopied(false), 2500);
		}
	}

	async function handleDownload() {
		setDownloading(true);
		try {
			const res = await fetch(`/api/images/download?url=${encodeURIComponent(gen.imageUrl)}`);
			if (!res.ok) throw new Error("Download failed");
			const blob = await res.blob();
			const blobUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = blobUrl;
			a.download = "zellers-avurudu-avatar.jpg";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			setTimeout(() => URL.revokeObjectURL(blobUrl), 200);
		} catch {
			window.open(gen.imageUrl, "_blank");
		} finally {
			setDownloading(false);
		}
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg"
		>
			{/* Image */}
			<div className="relative aspect-[3/4] w-full bg-white/5 overflow-hidden">
				<img
					src={gen.imageUrl}
					alt={`Avatar ${gen.postNumber ?? gen.postId}`}
					className="w-full h-full object-cover"
				/>
				{/* Overlay badge for attempt number */}
				<div className="absolute top-2 right-2">
					<StatusBadge gen={gen} />
				</div>
			</div>

			{/* Info */}
			<div className="p-3 flex flex-col gap-2 flex-1">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-white font-bold text-sm leading-tight">
							{gen.postNumber ? `Avatar #${gen.postNumber}` : "Your Avatar"}
						</p>
						{gen.flavor && (
							<p className="text-gray-400 text-[11px]">
								{FLAVOUR_LABELS[gen.flavor] ?? gen.flavor}
							</p>
						)}
					</div>
					<p className="text-gray-500 text-[10px] shrink-0">{formatDate(gen.createdAt)}</p>
				</div>

				{error && (
					<p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1">{error}</p>
				)}

				{/* Submit CTA — only if not yet submitted */}
				{!gen.submitted && (
					<motion.button
						onClick={handleSubmit}
						disabled={submitting}
						whileTap={{ scale: 0.97 }}
						className="w-full py-2.5 mt-auto bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-black tracking-widest rounded-xl shadow-[0_4px_14px_rgba(234,179,8,0.35)] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 hover:shadow-[0_4px_20px_rgba(234,179,8,0.5)]"
					>
						<Trophy size={13} />
						{submitting ? "SUBMITTING…" : "SUBMIT FOR CONTEST"}
					</motion.button>
				)}

				{gen.submitted && gen.approvalStatus === "approved" && (
					<div className="flex items-center gap-1.5 justify-center text-green-400 text-xs font-bold py-1">
						<CheckCircle2 size={13} />
						Entry Approved ✓
					</div>
				)}

				{gen.submitted && gen.approvalStatus === "pending" && (
					<div className="flex items-center gap-1.5 justify-center text-blue-300 text-xs font-semibold py-1">
						<Clock size={13} />
						Pending Admin Review
					</div>
				)}

				{gen.submitted && gen.approvalStatus === "rejected" && (
					<div className="flex items-center gap-1.5 justify-center text-red-400 text-xs font-semibold py-1">
						<XCircle size={13} />
						Entry Not Accepted
					</div>
				)}

				{/* Download + Copy — always visible once generated */}
				<div className="flex gap-1.5 mt-1">
					<button
						onClick={handleCopyCaption}
						title="Copy caption to clipboard"
						className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-bold transition-all ${captionCopied
							? "bg-green-500/20 border border-green-500/40 text-green-300"
							: "bg-white/8 border border-white/15 text-gray-400 hover:text-white hover:bg-white/12"
							}`}
					>
						{captionCopied ? <><CheckIcon size={11} /> Copied</> : <><Copy size={11} /> Caption</>}
					</button>
					<button
						onClick={handleDownload}
						disabled={downloading}
						title="Download photo"
						className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/8 border border-white/15 text-gray-400 hover:text-white hover:bg-white/12 rounded-xl text-[10px] font-bold transition-all disabled:opacity-50"
					>
						<Download size={11} />
						{downloading ? "Saving…" : "Download"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
export default function UserDashboard({ generations: initialGenerations, canStartNewAttempt, onStartNewAttempt, displayName: propDisplayName, gender: propGender }: Props) {
	const token = typeof window !== "undefined" ? sessionStorage.getItem("auth_token") ?? "" : "";
	const displayName = propDisplayName || (typeof window !== "undefined" ? sessionStorage.getItem("user_display_name") ?? undefined : undefined);
	const gender = propGender || (typeof window !== "undefined" ? sessionStorage.getItem("user_gender") ?? undefined : undefined);
	const [generations, setGenerations] = useState<Generation[]>(initialGenerations);

	function handleSubmitted(postId: string) {
		setGenerations((prev) =>
			prev.map((g) => g.postId === postId ? { ...g, submitted: true, approvalStatus: "pending" } : g)
		);
	}

	const hasUnsubmitted = generations.some((g) => !g.submitted);

	return (
		<div className="min-h-screen bg-transparent flex flex-col font-sans relative">
			{/* Background */}
			<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#1E0B4B]">
				<div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[#00E5FF]/35 blur-[160px]" />
				<div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#00E5FF]/35 blur-[160px]" />
				<div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#9D00FF]/30 blur-[140px]" />
			</div>

			<div className="flex-1 w-full max-w-2xl mx-auto px-4 py-20 pb-28">

				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -16 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 mb-4">
						<Trophy size={14} className="text-yellow-400" />
						<span className="text-[10px] font-bold tracking-[0.25em] text-yellow-400 uppercase">Welcome Back</span>
					</div>
					<h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
						Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">Zellers Avatars</span>
					</h1>
					<p className="text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
						{hasUnsubmitted
							? "You have generated avatar(s) that haven't been entered into the contest yet. Submit below to be in with a chance to win!"
							: "Your avatars are below. Start a new attempt to generate a fresh look."}
					</p>
				</motion.div>

				{/* Submission reminder banner */}
				<AnimatePresence>
					{hasUnsubmitted && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="mb-6 overflow-hidden"
						>
							<div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 rounded-2xl px-4 py-3 flex items-start gap-3">
								<div className="text-xl shrink-0 mt-0.5">🏆</div>
								<div>
									<p className="text-amber-300 font-bold text-sm mb-0.5">Ready to enter the competition?</p>
									<p className="text-amber-200/80 text-xs leading-relaxed">
										Tap <strong className="text-amber-300">"Submit for Contest"</strong> on your avatar below to enter the Zellers Avurudu AI Avatar competition. The best avatars win exciting prizes!
									</p>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Generations grid */}
				<motion.div
					layout
					className={`grid gap-4 mb-8 ${generations.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-2 sm:grid-cols-3"}`}
				>
					{generations.map((gen) => (
						<GenerationCard
							key={gen.postId}
							gen={gen}
							token={token}
							onSubmitted={handleSubmitted}
							displayName={displayName}
							gender={gender}
						/>
					))}
				</motion.div>

				{/* New attempt CTA */}
				<div className="flex flex-col items-center gap-3">
					{canStartNewAttempt ? (
						<motion.button
							whileTap={{ scale: 0.97 }}
							onClick={onStartNewAttempt}
							className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white text-sm font-bold tracking-wide rounded-xl hover:bg-white/15 transition-all"
						>
							<RefreshCw size={15} />
							Start New Attempt
						</motion.button>
					) : (
						<p className="text-gray-500 text-xs text-center max-w-[260px]">
							You&apos;ve used all 3 attempts. Submit one of your generated avatars above to enter the contest.
						</p>
					)}
					<a href="/vote" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors">
						View Gallery <ArrowRight size={12} />
					</a>
				</div>

			</div>
		</div>
	);
}
