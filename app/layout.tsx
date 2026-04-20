import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const playfair = Playfair_Display({
  variable: "--font-playfair-var",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zellers Chocolates — AI Avurudu",
  description:
    "Transform into a legendary AI Avurudu Kumara or Kumariya with Zellers Chocolates. Create your royal avatar and win big!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-transparent`}
    >
      <body className="min-h-screen flex flex-col">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
