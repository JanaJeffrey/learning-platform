import type { Config } from 'tailwindcss';

const config: Config = {
  // ============================================
  // DARK MODE CONFIGURATION
  // ============================================
  // 'class' means we manually add/remove 'dark' class on <html> element
  // This gives us full control over when dark mode is active
  darkMode: 'class',
  
  // ============================================
  // CONTENT PATHS - Where Tailwind looks for classes
  // ============================================
  // Tailwind scans these folders to find which classes you're using
  // This keeps your final CSS file small (only includes used classes)
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // ============================================
  // THEME EXTENSION - Add custom styles here
  // ============================================
  theme: {
    extend: {
      // You can add custom colors, fonts, animations here
      // Example: colors: { primary: '#3b82f6' }
      // Example: animation: { 'slow-spin': 'spin 3s linear infinite' }
    },
  },
  
  // ============================================
  // PLUGINS - Additional Tailwind features
  // ============================================
  // You can add plugins like @tailwindcss/forms, @tailwindcss/typography
  plugins: [],
};

export default config;