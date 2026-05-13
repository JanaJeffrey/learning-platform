"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AboutPage() {
  const { isAuthenticated } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <div className="relative overflow-hidden pt-8 md:pt-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-600/10 dark:to-indigo-600/10"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <span className="mr-2">🌟</span>
            Empowering Learners Worldwide
            <span className="ml-2">🌟</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            We Believe Everyone
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Deserves Quality Education
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            At LearnHub, we're breaking down barriers to education. Our mission is to make 
            high-quality learning accessible to everyone, everywhere, regardless of their 
            location or financial situation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ============================================
            STATS CARDS
            ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 text-center">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
              🎓
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">10,000+</div>
            <div className="text-gray-500 dark:text-gray-400">Happy Students</div>
          </div>
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 text-center">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
              📚
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">500+</div>
            <div className="text-gray-500 dark:text-gray-400">Expert Courses</div>
          </div>
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 text-center">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
              👨‍🏫
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">100+</div>
            <div className="text-gray-500 dark:text-gray-400">Top Instructors</div>
          </div>
        </div>

        {/* ============================================
            MISSION SECTION
            ============================================ */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
              Our Mission
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Making Quality Education Accessible to Everyone
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Education is the most powerful tool we have to change the world. At LearnHub, 
              we believe that every person deserves access to quality learning resources, 
              regardless of their background or financial situation.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["JS", "MK", "SC", "AR"].map((initials, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-gray-900">
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Trusted by students worldwide</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">💡</div>
            <p className="text-gray-700 dark:text-gray-300 italic text-lg">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-3">— B.B. King</p>
          </div>
        </div>

        {/* ============================================
            VALUES SECTION
            ============================================ */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These principles guide everything we do at LearnHub
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Excellence</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">We strive for the highest quality in every course we offer.</p>
            </div>
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Community</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Learning together creates better outcomes for everyone.</p>
            </div>
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Accessibility</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Education should be available to everyone, everywhere.</p>
            </div>
          </div>
        </div>

        {/* ============================================
            CTA SECTION - BEAUTIFUL MODERN DESIGN
            Light mode: Soft gradient + subtle border + floating effect
            Dark mode: Glassmorphic design with neon glow
            ============================================ */}
        <div className="mt-8">
          {!isDark ? (
            // ========== LIGHT MODE CTA ==========
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-12 text-center shadow-xl transition-all duration-500 hover:scale-[1.02]">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 via-indigo-200/30 to-purple-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Subtle border glow */}
              <div className="absolute inset-0 rounded-2xl border border-blue-200/50 shadow-inner"></div>
              
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-blue-200 mb-6">
                  <span className="text-2xl">🚀</span>
                  <span className="text-sm font-medium text-blue-700">Limited Time Offer</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Ready to Start Your Journey?
                </h2>
                
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                  Join thousands of students already learning on LearnHub
                </p>
                
                <Link
                  href={isAuthenticated ? "/courses" : "/register"}
                  className="group/btn inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span>{isAuthenticated ? "Explore Courses" : "Get Started Free"}</span>
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            // ========== DARK MODE CTA ==========
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-12 text-center shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              {/* Glassmorphic border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Neon glow border */}
              <div className="absolute inset-0 rounded-2xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-shadow duration-500"></div>
              
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Decorative glowing orbs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              {/* Dot pattern overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "32px 32px"
              }}></div>
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700/50 backdrop-blur-sm border border-gray-600 mb-6">
                  <span className="text-2xl">✨</span>
                  <span className="text-sm font-medium text-blue-400">Begin Your Adventure</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Start Your Journey?
                </h2>
                
                <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
                  Join thousands of students already learning on LearnHub
                </p>
                
                <Link
                  href={isAuthenticated ? "/courses" : "/register"}
                  className="group/btn inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                >
                  <span>{isAuthenticated ? "Explore Courses" : "Get Started Free"}</span>
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}