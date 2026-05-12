"use client";

import Link from "next/link";
import { useState } from "react";
import emailjs from '@emailjs/browser';

// Your EmailJS credentials
const EMAILJS_PUBLIC_KEY = 'n-yV9ouamzrR9x55N';
const EMAILJS_SERVICE_ID = 'service_6ihx9bi';
const EMAILJS_NEWSLETTER_TEMPLATE = 'template_dyqgnzv'; // Your newsletter template ID

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Your social media links
  const socialLinks = {
    linkedin: "https://www.linkedin.com/in/nyigba-jeffrey-23bb993aa",
    github: "https://github.com/JanaJeffrey",
    whatsapp: "https://wa.me/2349165361515",
    twitter: "https://twitter.com/janajeffrey01",
    tiktok: "https://www.tiktok.com/@jana_jeffrey44",
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      alert("Please enter a valid email address");
      return;
    }

    setNewsletterStatus("loading");

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_NEWSLETTER_TEMPLATE,
        {
          email: newsletterEmail,
          date: new Date().toLocaleString(),
          ip: "User IP",
        },
        EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        setNewsletterStatus("success");
        setNewsletterEmail("");
        setTimeout(() => setNewsletterStatus("idle"), 3000);
      } else {
        setNewsletterStatus("error");
        setTimeout(() => setNewsletterStatus("idle"), 3000);
      }
    } catch (err) {
      console.error("Newsletter error:", err);
      setNewsletterStatus("error");
      setTimeout(() => setNewsletterStatus("idle"), 3000);
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* COLUMN 1: BRAND / LOGO SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-gray-800 dark:text-white font-bold text-xl">
                LearnHub
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Empowering learners worldwide with quality education.
            </p>
          </div>
          
          {/* COLUMN 2: QUICK LINKS SECTION */}
          <div>
            <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/courses" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Courses</Link></li>
              <li><Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>
          
          {/* COLUMN 3: SUPPORT SECTION */}
          <div>
            <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Help Center</Link></li>
              <li><Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* COLUMN 4: SOCIAL MEDIA + NEWSLETTER */}
          <div>
            <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-4">Follow Me</h3>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {/* LinkedIn */}
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#0077B5] rounded-full flex items-center justify-center hover:bg-[#005e8c] transition-all duration-200 hover:scale-110 shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.222 0 22.225 0z"/>
                </svg>
              </a>
              
              {/* GitHub */}
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#181717] rounded-full flex items-center justify-center hover:bg-[#0d0d0d] transition-all duration-200 hover:scale-110 shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              
              {/* X (Twitter) */}
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-900 transition-all duration-200 hover:scale-110 shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* TikTok */}
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-r from-[#00f2ea] to-[#ff0050] rounded-full flex items-center justify-center hover:opacity-90 transition-all duration-200 hover:scale-110 shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.58a6.34 6.34 0 0 0 10.86 4.23 6.34 6.34 0 0 0 1.78-4.23V2h3.45a4.83 4.83 0 0 0 3.77 4.25v2.69z"/>
                </svg>
              </a>
              
              {/* WhatsApp */}
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center hover:bg-[#20b858] transition-all duration-200 hover:scale-110 shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 1.999c-5.516 0-9.999 4.484-9.999 10 0 1.868.521 3.686 1.507 5.271l-1.509 5.47 5.655-1.462c1.484.825 3.177 1.262 4.938 1.262 5.516 0 10-4.484 10-10 0-5.516-4.484-10-10-10zM12.031 19.999c-1.563 0-3.084-.422-4.405-1.213l-.317-.188-3.357.864.89-3.235-.207-.331c-.857-1.34-1.311-2.891-1.311-4.495 0-4.5 3.665-8.165 8.165-8.165 4.5 0 8.165 3.665 8.165 8.165 0 4.5-3.665 8.165-8.165 8.165zm4.474-6.115c-.246-.123-1.456-.714-1.682-.796-.226-.082-.39-.123-.555.123-.165.246-.639.795-.783.958-.144.164-.289.185-.535.062-.246-.123-1.039-.382-1.979-1.218-.732-.652-1.225-1.456-1.368-1.702-.144-.246-.015-.379.108-.502.111-.111.246-.286.37-.429.123-.144.164-.246.246-.411.082-.164.041-.308-.021-.431-.062-.123-.555-1.338-.761-1.833-.2-.48-.403-.416-.555-.423-.144-.007-.309-.008-.474-.008-.164 0-.431.062-.657.308-.226.246-.862.842-.862 2.054 0 1.212.882 2.383 1.005 2.548.123.164 1.735 2.647 4.207 3.716.593.257 1.056.411 1.416.525.595.189 1.136.162 1.564.098.477-.072 1.456-.594 1.662-1.167.205-.574.205-1.066.144-1.167-.062-.102-.226-.164-.472-.287z"/>
                </svg>
              </a>
            </div>
            
            {/* Newsletter Signup - WORKING NOW */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Subscribe to our newsletter
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 flex-1"
                  required
                  disabled={newsletterStatus === "loading"}
                />
                <button 
                  type="submit"
                  disabled={newsletterStatus === "loading"}
                  className="px-3 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-r-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {newsletterStatus === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
              {newsletterStatus === "success" && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">✅ Subscribed! You'll receive updates.</p>
              )}
              {newsletterStatus === "error" && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">❌ Failed. Please try again.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* COPYRIGHT SECTION */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} LearnHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}