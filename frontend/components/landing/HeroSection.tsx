"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Animated background orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE - TEXT CONTENT */}
          <div className="text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800">
              <span className="mr-2 text-lg">✨</span>
              Join 10,000+ happy learners
              <span className="ml-2 text-lg">✨</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Learn Anything,
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Anytime, Anywhere
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Master new skills with expert-led courses. Join thousands of students
              who are transforming their careers and lives through our platform.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register" 
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Start Learning Free</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link 
                    href="/courses" 
                    className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
                  >
                    <span>Browse Courses</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/courses" 
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Continue Learning</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link 
                    href="/dashboard/student" 
                    className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
                  >
                    <span>My Dashboard</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Trust indicators */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-bold">
                  +
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white">Trusted by 10,000+</span> students worldwide
              </div>
            </div>
          </div>
          
          {/* RIGHT SIDE - PREVIEW CARD */}
          <div className="relative">
            
            {/* Main Card */}
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 border border-white/20 dark:border-gray-700/50">
              
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-md"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-md"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-md"></div>
                  </div>
                  <span className="text-white text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    🔥 Popular Course
                  </span>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-6">
                {/* Course Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-3xl shadow-lg">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Complete Web Development</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">By Prof. Sarah Johnson</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500 text-xs">★★★★★</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">4.9 (2.3k reviews)</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Your Progress</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-2.5 rounded-full w-3/4"></div>
                  </div>
                </div>
                
                {/* Lesson List */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs shadow-sm">✓</div>
                    <span className="text-gray-700 dark:text-gray-300">Introduction to HTML</span>
                    <span className="text-xs text-green-600 dark:text-green-400 ml-auto">Completed</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs shadow-sm">✓</div>
                    <span className="text-gray-700 dark:text-gray-300">CSS Fundamentals</span>
                    <span className="text-xs text-green-600 dark:text-green-400 ml-auto">Completed</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs shadow-sm">▶</div>
                    <span className="text-gray-900 dark:text-white font-medium">JavaScript Basics</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 ml-auto">In Progress</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-2 rounded-lg opacity-60">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <span className="text-gray-500 dark:text-gray-400">React JS Mastery</span>
                    <span className="text-xs text-gray-400 ml-auto">Locked</span>
                  </div>
                </div>
                
                {/* Continue Button */}
                <button className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300">
                  Continue Learning →
                </button>
              </div>
            </div>
            
            {/* Floating Rating Badge */}
            <div className="absolute -top-6 -right-6 bg-white/90 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-2xl p-4 animate-bounce-slow border border-white/20 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  ⭐
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">4.8 Rating</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">From 5,234+ reviews</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-xs">★★★★★</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Stats Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white/90 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-2xl p-4 animate-bounce-slow animation-delay-2000 border border-white/20 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  🎯
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">500+ Courses</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Expert-led content</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-green-500 text-xs">●</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Updated weekly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ============================================
          WAVE BOTTOM - FIXED: White in light mode, Dark gray in dark mode
          ============================================ */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 64L60 74.7C120 85 240 107 360 106.7C480 107 600 85 720 74.7C840 64 960 64 1080 69.3C1200 75 1320 85 1380 90.7L1440 96V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V64Z" fill="#ffffff" className="dark:fill-gray-900"/>
        </svg>
      </div>
    </section>
  );
}