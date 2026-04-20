"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type Post = {
	postId: string;
	postNumber: number;
	displayName: string;
	gender: "male" | "female";
	flavor: string;
	voteCount: number;
	imageUrl?: string;
};

const containerVariants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.12 },
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 60 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.65, ease: "easeOut" as const },
	},
};

// Placeholder Avatar component
function PlaceholderAvatar({ post }: { post: Post }) {
	const initials = post.displayName
		.split(" ")
		.map((w) => w[0] ?? "")
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const gradient =
		post.gender === "male"
			? "from-blue-700 via-indigo-700 to-violet-800"
			: "from-pink-600 via-rose-600 to-purple-700";

	return (
		<div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
			<span className="text-5xl sm:text-6xl font-black text-white/25 select-none tracking-wider drop-shadow-2xl">
				{initials}
			</span>
		</div>
	);
}

export default function MeetTheAvatars() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const res = await fetch("/api/posts?page=1");
				const data = await res.json();
				if (data.success && data.posts) {
					// Get top 8 posts by vote count
					const topPosts = data.posts.slice(0, 8);
					setPosts(topPosts);
				}
			} catch (error) {
				console.error("Failed to fetch posts:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchPosts();
	}, []);

	return (
		<section className="relative py-16 sm:py-24 px-3 sm:px-4 overflow-hidden">

			{/* ─── EXPERT UI: Unified Hero Mesh Gradient Background ─── */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-transparent"
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

			<div className="relative z-10 max-w-6xl mx-auto">
				{/* Section header */}
				<div className="text-center mb-10 sm:mb-14 space-y-3">
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-xs font-bold tracking-[0.4em] uppercase text-yellow-400 drop-shadow-md"
					>
						COMMUNITY SHOWCASE
					</motion.p>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-gray-100 tracking-tight leading-tight"
					>
						Meet your Zellers AI අවුරුදු කුමරා and අවුරුදු කුමරිය
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="text-base text-blue-200/60 font-medium"
					>
						The royals have arrived — are you next?
					</motion.p>
				</div>

				{/* Gallery grid - 4x2 layout */}
				{loading ? (
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
						{[...Array(8)].map((_, i) => (
							<div key={i} className="w-full aspect-[3/5] bg-white/5 rounded-2xl animate-pulse" />
						))}
					</div>
				) : (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-60px" }}
						className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
					>
						{posts.map((post) => (
							<Link key={post.postId} href="/vote">
								<motion.div
									variants={cardVariants}
									className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-xl"
								>
									{/* Image */}
									<div className="relative w-full aspect-[3/5] overflow-hidden bg-white/5">
										{post.imageUrl ? (
											<Image
												src={post.imageUrl}
												alt={post.displayName}
												fill
												sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
												className="object-cover transition-transform duration-500 group-hover:scale-110"
											/>
										) : (
											<PlaceholderAvatar post={post} />
										)}
									</div>

									{/* Bottom gradient overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-[#1E0B4B]/95 via-[#1E0B4B]/40 to-transparent pointer-events-none" />

									{/* Post number badge */}
									<div className="absolute top-2.5 left-2.5">
										<span className="text-[10px] font-extrabold text-gray-100 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10 shadow-md">
											#{post.postNumber}
										</span>
									</div>

									{/* Gender badge */}
									<div className="absolute top-2.5 right-2.5">
										<span className={`text-[9px] font-extrabold tracking-widest text-white rounded-full px-2.5 py-1 shadow-md ${post.gender === "male"
												? "bg-gradient-to-r from-blue-500 to-indigo-500"
												: "bg-gradient-to-r from-pink-500 to-rose-500"
											}`}>
											{post.gender === "male" ? "KUMARA" : "KUMARIYA"}
										</span>
									</div>

									{/* Bottom text */}
									<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
										<p className="text-xs sm:text-sm font-bold text-gray-100 leading-tight drop-shadow-sm truncate mb-1">
											{post.displayName}
										</p>
										<p className="text-[10px] sm:text-[11px] text-yellow-400/80 font-medium truncate mb-2">
											{post.flavor}
										</p>
										{/* Vote count and button */}
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-1.5">
												<span className="text-yellow-400 text-sm">✦</span>
												<span className="text-xs font-bold text-yellow-400">
													{post.voteCount}
												</span>
												<span className="text-[10px] text-gray-400 uppercase tracking-wider">
													votes
												</span>
											</div>
											<button className="text-[10px] font-bold tracking-widest text-black bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full px-3 py-1 hover:brightness-110 transition-all duration-200 shadow-[0_0_15px_rgba(234,179,8,0.4)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
												VOTE
											</button>
										</div>
									</div>

									{/* Gold border glow on hover */}
									<div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-yellow-400/50 transition-all duration-300 pointer-events-none" />
								</motion.div>
							</Link>
						))}
					</motion.div>
				)}

				{/* View all CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="flex justify-center mt-12"
				>
					<Link href="/vote" className="text-sm font-bold tracking-widest text-yellow-400 border border-yellow-500/40 rounded-full px-10 py-3 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-200 backdrop-blur-sm shadow-[0_0_20px_rgba(234,179,8,0.1)]">
						VIEW FULL GALLERY →
					</Link>
				</motion.div>

				{/* Bottom separator */}
				<div className="flex items-center gap-4 mt-16 opacity-40">
					<div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
					<span className="text-white/40 text-sm">✦</span>
					<div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
				</div>
			</div>
		</section>
	);
}