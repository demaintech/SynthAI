import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SynthAI - Neural Interface",
  description: "Next-generation AI conversation platform",
};

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#0a0a0a] text-[#f5f5f5]`}>
        <LayoutClient>{children}</LayoutClient>
        <ToastContainer theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
