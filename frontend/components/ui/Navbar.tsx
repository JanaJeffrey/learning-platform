"use client";

// ============================================
// PROFESSIONAL NAVBAR WITH SLIDE-OUT SIDEBAR
// ============================================
// Features:
// - Desktop: Normal horizontal navbar
// - Mobile: Slide-out sidebar from left
// - Dark mode toggle in BOTH desktop and mobile
// - Active page highlighting
// - User dropdown menu on desktop
// - Dashboard link visible in desktop navbar (NEW)

import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isSidebarOpen && !target.closest('.sidebar-menu') && !target.closest('.hamburger-button')) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsSidebarOpen(false);
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  // Navigation links configuration - Dashboard added for authenticated users
  const getNavLinks = () => {
    const baseLinks = [
      { href: "/", label: "Home", icon: "🏠" },
      { href: "/courses", label: "Courses", icon: "📚" },
      { href: "/about", label: "About", icon: "ℹ️" },
    ];
    
    // Add Dashboard link for authenticated users
    if (isAuthenticated) {
      baseLinks.push({ 
        href: user?.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student", 
        label: "Dashboard", 
        icon: "📊" 
      });
    }
    
    return baseLinks;
  };

  // Sidebar menu items (for mobile)
  const sidebarLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/courses", label: "Courses", icon: "📚" },
    { href: "/about", label: "About", icon: "ℹ️" },
  ];

  const sidebarAuthLinks = isAuthenticated ? [
    { href: user?.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student", label: "Dashboard", icon: "📊" },
    { href: "/profile", label: "Your Profile", icon: "👤" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
    { href: "/help", label: "Help Center", icon: "❓" },
  ] : [
    { href: "/login", label: "Log in", icon: "🔑" },
    { href: "/register", label: "Sign Up", icon: "✨" },
  ];

  const navLinks = getNavLinks();

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800"
            : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* LEFT SIDE: Hamburger Menu + Logo */}
            <div className="flex items-center gap-3">
              
              {/* Hamburger Menu Button - Mobile only */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hamburger-button md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    LearnHub
                  </span>
                  <span className="hidden lg:inline text-xs text-gray-400 dark:text-gray-500 ml-1">™</span>
                </div>
              </Link>
            </div>

            {/* DESKTOP NAVIGATION - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative px-4 py-2 rounded-lg font-medium transition-all duration-200
                      flex items-center space-x-2 group
                      ${active 
                        ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30" 
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                    
                    {active && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                    )}
                    
                    {!active && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT SIDE: Theme Toggle + Auth Buttons (Desktop) */}
            <div className="flex items-center space-x-2">
              
              {/* Theme Toggle Button */}
              <ThemeToggle />
              
              {/* Desktop Auth Buttons - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 focus:outline-none ml-2">
                      <div className="relative">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md transition-all duration-200 group-hover:scale-105">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium hidden lg:block">
                        {user?.name?.split(" ")[0] || "User"}
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            {user?.role === "instructor" ? "Instructor" : "Student"}
                          </span>
                        </div>
                        <Link href="/profile" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">👤 Your Profile</Link>
                        <Link href="/settings" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">⚙️ Settings</Link>
                        <Link href="/help" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">❓ Help Center</Link>
                        <hr className="my-1 border-gray-100 dark:border-gray-700" />
                        <button onClick={handleLogout} className="flex items-center space-x-3 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">🚪 Sign Out</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600">Log in</Link>
                    <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition">Sign Up Free</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
            isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
        
        {/* Sidebar Panel */}
        <div
          className={`sidebar-menu fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">LearnHub</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* User Info Section (if logged in) */}
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {user?.role === "instructor" ? "Instructor" : "Student"}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Links */}
          <div className="py-4 flex-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isActive(link.href) ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600" : ""
                }`}
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            <div className="my-2 h-px bg-gray-100 dark:bg-gray-800 mx-4"></div>
            
            {/* Auth-specific links */}
            {sidebarAuthLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isActive(link.href) ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600" : ""
                }`}
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            {/* Theme Toggle in Sidebar */}
            <div className="my-2 h-px bg-gray-100 dark:bg-gray-800 mx-4"></div>
            
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{darkMode ? "🌙" : "☀️"}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
            
            {/* Logout button for logged in users */}
            {isAuthenticated && (
              <>
                <div className="my-2 h-px bg-gray-100 dark:bg-gray-800 mx-4"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-3 w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <span className="text-2xl">🚪</span>
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </>
    </>
  );
}