"use client";

// ============================================
// WHAT DOES THIS FILE DO?
// ============================================
// Think of this as the "brain" that remembers:
// - Is the user logged in?
// - Who is the user? (name, email, role)
// - What's their JWT token?
// 
// This "brain" is available on EVERY page of your website!

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login as loginApi, register as registerApi } from '@/lib/api';
import { User } from '@/types';

// ============================================
// DEFINE THE SHAPE OF OUR AUTH CONTEXT
// ============================================
// This is like a blueprint saying: 
// "Our auth system will have these things available"

interface AuthContextType {
  // Data states
  user: User | null;           // The logged-in user info (or null if not logged in)
  token: string | null;        // JWT token for API calls
  isLoading: boolean;          // Are we checking login status? (show loading spinner)
  isAuthenticated: boolean;    // Is user logged in? (true/false)

  // Functions we can call
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

// ============================================
// CREATE THE CONTEXT
// ============================================
// This creates an empty container that will hold our auth data

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// THE AUTH PROVIDER COMPONENT
// ============================================
// This component "provides" the auth data to all child components

interface AuthProviderProps {
  children: ReactNode;  // All the pages/components inside your app
}

export function AuthProvider({ children }: AuthProviderProps) {
  // ============================================
  // STATE VARIABLES (like memory boxes)
  // ============================================
  
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ============================================
  // CHECK IF USER WAS ALREADY LOGGED IN
  // ============================================
  // This runs ONCE when your app first loads
  // It checks localStorage for saved login data

  useEffect(() => {
    // Try to get saved data from browser's localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      // Found saved data! User was logged in before
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    // Done checking, stop showing loading spinner
    setIsLoading(false);
  }, []); // Empty array means: "Run this only once when component mounts"

  // ============================================
  // LOGIN FUNCTION
  // ============================================
  // Called when user submits the login form

  const login = async (email: string, password: string) => {
    try {
      // Call the backend API to login
      const response = await loginApi(email, password);
      
      // response contains: { success: true, token: "jwt...", user: {...} }
      const { token: newToken, user: userData } = response;

      // Save to state (temporary memory)
      setToken(newToken);
      setUser(userData);

      // Save to localStorage (permanent memory - survives page refresh)
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw so the component can show error message
    }
  };

  // ============================================
  // REGISTER FUNCTION
  // ============================================
  // Called when user submits the registration form

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      // Call the backend API to register
      const response = await registerApi(name, email, password, role);
      
      // response contains: { success: true, token: "jwt...", user: {...} }
      const { token: newToken, user: userData } = response;

      // Save to state (temporary memory)
      setToken(newToken);
      setUser(userData);

      // Save to localStorage (permanent memory)
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // ============================================
  // LOGOUT FUNCTION
  // ============================================
  // Called when user clicks "Logout" button

  const logout = () => {
    // Clear state (temporary memory)
    setToken(null);
    setUser(null);

    // Clear localStorage (permanent memory)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // ============================================
  // WHAT'S AVAILABLE TO CHILD COMPONENTS
  // ============================================
  // Any component inside AuthProvider can now use these!

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,  // !! converts to boolean: true if user exists
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// CUSTOM HOOK FOR USING AUTH
// ============================================
// This makes it easy for any component to access auth data
// Usage: const { user, login } = useAuth();

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}