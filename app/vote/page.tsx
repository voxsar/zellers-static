import type { Metadata } from "next";
import VotePageClient from "./VotePageClient";

export const metadata: Metadata = {
	title: "Avatar Gallery | AI Avurudu with Zellers",
	description: "Browse all AI Avurudu Kumara and Kumariya avatars from the AI Avurudu with Zellers contest.",
};

export default function VotePage() {
	return <VotePageClient />;
}
