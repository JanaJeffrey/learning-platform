"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AboutPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 pt-20">
      
      {/* ============================================
          HERO SECTION - No white banner
          ============================================ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-600/10 dark:to-indigo-600/10"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
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
            MISSION SECTION - Text now visible in dark mode
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
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">💡</div>
            <p className="text-gray-700 dark:text-gray-300 italic text-lg">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-3">— B.B. King</p>
          </div>
        </div>

        {/* ============================================
            VALUES SECTION - Text now visible in dark mode
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
            CTA SECTION - No team section, just the call to action
            ============================================ */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-800 dark:from-teal-900 dark:via-teal-900 dark:to-emerald-900"></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative px-8 py-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning on LearnHub
            </p>
            <Link
              href={isAuthenticated ? "/courses" : "/register"}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-700 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>{isAuthenticated ? "Explore Courses" : "Get Started Free"}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}