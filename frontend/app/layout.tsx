// ============================================
// WHAT DOES THIS FILE DO?
// ============================================
// This is the MAIN LAYOUT of your entire website
// It wraps EVERY page (home, courses, dashboard, etc.)
// Think of it as the "frame" around all your content

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";  // ← ADDED: For dark/light mode
import Navbar from "@/components/ui/Navbar";

// ============================================
// FONT CONFIGURATION (Your existing code)
// ============================================

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================
// PAGE METADATA (Shows in browser tab)
// ============================================

export const metadata: Metadata = {
  title: "LearnHub - Online Learning Platform",
  description: "Learn from the best instructors anywhere, anytime",
};

// ============================================
// ROOT LAYOUT COMPONENT
// ============================================
// This is the "wrapper" that contains your entire app

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ⭐ THEME PROVIDER - Enables dark/light mode across the entire app ⭐ */}
        {/* ThemeProvider must be OUTSIDE AuthProvider so theme works on login page too */}
        <ThemeProvider>
          {/* ⭐ AUTH PROVIDER - Makes auth available to ALL pages inside it ⭐ */}
          <AuthProvider>
            <Navbar />
            <div className="pt-16">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}