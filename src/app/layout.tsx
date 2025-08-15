import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Idox Public Protection Knowledge Base",
  description: "RAG-powered knowledge base for Idox Public Protection System documentation. Get instant answers about Environmental Health, Trading Standards, Licensing, and regulatory procedures.",
  keywords: ["Idox", "Public Protection", "Environmental Health", "Trading Standards", "Licensing", "Regulatory", "Knowledge Base"],
  authors: [{ name: "PP RAG System" }],
  openGraph: {
    title: "Idox Public Protection Knowledge Base",
    description: "AI-powered search and answers for regulatory professionals using the Idox Public Protection System.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}