"use client";

import { useState, useEffect } from "react";

export default function StatsSection() {
  const [counts, setCounts] = useState({ students: 0, courses: 0, instructors: 0, ratings: 0 });
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode - SAME METHOD THAT WORKED ON ABOUT PAGE
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targets = { students: 10000, courses: 500, instructors: 100, ratings: 4.8 };
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setCounts({
        students: Math.floor(targets.students * progress),
        courses: Math.floor(targets.courses * progress),
        instructors: Math.floor(targets.instructors * progress),
        ratings: Number((targets.ratings * progress).toFixed(1))
      });
      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts({ students: targets.students, courses: targets.courses, instructors: targets.instructors, ratings: targets.ratings });
      }
    }, stepTime);
  }, []);

  const stats = [
    { label: "Happy Students", value: counts.students.toLocaleString(), suffix: "+", icon: "👨‍🎓" },
    { label: "Courses Available", value: counts.courses.toLocaleString(), suffix: "+", icon: "📚" },
    { label: "Expert Instructors", value: counts.instructors.toLocaleString(), suffix: "+", icon: "👨‍🏫" },
    { label: "Average Rating", value: counts.ratings, suffix: "/5", icon: "⭐" }
  ];

  // If dark mode, use DARK background. If light mode, use LIGHT background
  const sectionBg = isDark ? "bg-black" : "bg-gradient-to-br from-slate-50 to-white";

  return (
    <section className={`py-20 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Top bar - colored for light mode, dark gray for dark mode */}
              {!isDark ? (
                <div className={`h-1 ${
                  idx === 0 ? "bg-blue-500" :
                  idx === 1 ? "bg-emerald-500" :
                  idx === 2 ? "bg-purple-500" :
                  "bg-amber-500"
                }`}></div>
              ) : (
                <div className="h-1 bg-gray-700"></div>
              )}
              
              <div className="p-6 text-center">
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}