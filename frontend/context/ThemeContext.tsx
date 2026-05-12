"use client";

// ============================================
// THEME CONTEXT - Manages Dark/Light Mode
// ============================================
// This is like a "brain" that remembers:
// - Is dark mode on or off?
// - How to switch between themes
// - Saves preference to localStorage

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define what the theme context provides
interface ThemeContextType {
  darkMode: boolean;           // Is dark mode currently ON?
  toggleDarkMode: () => void;  // Function to switch themes
}

// Create the context (empty container)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component - wraps your entire app
export function ThemeProvider({ children }: { children: ReactNode }) {
  // State: Is dark mode on? (default: false = light mode)
  const [darkMode, setDarkMode] = useState(false);
  
  // State to track if component has mounted (prevens hydration mismatch)
  const [mounted, setMounted] = useState(false);

  // When component first loads, check localStorage for saved preference
  useEffect(() => {
    setMounted(true);
    
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Also check if user's system prefers dark mode
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Decide which theme to use:
    // 1. Use saved preference if exists
    // 2. Otherwise use system preference
    // 3. Default to light mode
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else if (systemPrefersDark) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Function to toggle between dark and light mode
  const toggleDarkMode = () => {
    if (darkMode) {
      // Switching to LIGHT mode
      setDarkMode(false);
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      // Switching to DARK mode
      setDarkMode(true);
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // Provide the state and function to all child components
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}