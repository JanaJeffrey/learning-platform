"use client";

import { useState, useEffect } from "react";

export default function FeaturesSection() {
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

  const features = [
    {
      icon: "🎓",
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📹",
      title: "High-Quality Videos",
      description: "Crystal clear 4K video lessons with downloadable resources.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🎯",
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress tracking.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Learn anywhere, anytime on any device - phone, tablet, or computer.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "🎓",
      title: "Certificates",
      description: "Earn verified certificates upon course completion to showcase your skills.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: "💬",
      title: "Community Support",
      description: "Join our active community of learners and get help anytime.",
      color: "from-rose-500 to-orange-500"
    }
  ];

  // Determine backgrounds based on dark mode
  const sectionBg = isDark ? "bg-black" : "bg-gray-50";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";

  return (
    <section className={`py-20 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LearnHub?
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We provide everything you need to succeed in your learning journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group ${cardBg} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}