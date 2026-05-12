"use client";

// ============================================
// WHAT DOES THIS PAGE DO?
// ============================================
// This is the login page where users enter their email and password
// When they submit, it calls the backend, gets a token, and logs them in

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // ============================================
  // HOOKS (React's special functions)
  // ============================================
  
  const { login } = useAuth();        // Get the login function from AuthContext
  const router = useRouter();          // For redirecting after login

  // ============================================
  // STATE VARIABLES (form data and UI state)
  // ============================================
  
  const [email, setEmail] = useState("");           // User's email input
  const [password, setPassword] = useState("");     // User's password input
  const [isLoading, setIsLoading] = useState(false); // Show loading spinner?
  const [error, setError] = useState("");            // Show error message?

  // ============================================
  // HANDLE FORM SUBMISSION
  // ============================================
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent browser from refreshing the page
    
    // Clear any previous error
    setError("");
    
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    // Show loading spinner and disable form
    setIsLoading(true);
    
    try {
      // Call the login function from AuthContext
      // This sends email/password to backend
      await login(email, password);
      
      // If successful, redirect to homepage
      // (AuthContext automatically saves the token and user data)
      router.push("/");
      
    } catch (err: any) {
      // If login fails, show the error message
      setError(err.message || "Login failed. Please try again.");
    } finally {
      // Hide loading spinner (whether success or failure)
      setIsLoading(false);
    }
  };

  // ============================================
  // UI COMPONENT (What users see)
  // ============================================
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header Section */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        
        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Error Message Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {/* Input Fields */}
          <div className="rounded-md shadow-sm -space-y-px">
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                disabled={isLoading}
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                // Show loading spinner when submitting
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          
          {/* Demo Credentials Info (for testing) */}
          <div className="text-center text-sm text-gray-500">
            <p>Demo credentials (once backend is ready):</p>
            <p className="text-xs">Email: student@example.com / Password: 123456</p>
          </div>
        </form>
      </div>
    </div>
  );
}