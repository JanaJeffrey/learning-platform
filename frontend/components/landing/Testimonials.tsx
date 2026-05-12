"use client";

import { useState } from "react";

export default function Testimonials() {
  const testimonials = [
    { id: 1, name: "John Anderson", role: "Software Engineer", company: "Google", image: "👨‍💻", text: "This platform transformed my career. The courses are practical, up-to-date, and the instructors are amazing. I got promoted within 6 months!", rating: 5 },
    { id: 2, name: "Sarah Martinez", role: "Product Designer", company: "Microsoft", image: "👩‍🎨", text: "The UI/UX Design course was exactly what I needed. The projects helped me build an impressive portfolio, and I landed my dream job!", rating: 5 },
    { id: 3, name: "David Kim", role: "Data Scientist", company: "Amazon", image: "👨‍🔬", text: "Best investment I ever made. The Machine Learning course covers everything from basics to advanced concepts. The community support is incredible.", rating: 5 }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const t = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Students Say
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join thousands of successful learners worldwide
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl">
              {t.image}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">{t.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t.role} at {t.company}</p>
            </div>
          </div>
          
          <div className="flex gap-1 mb-6">
            {[...Array(t.rating)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-2xl">★</span>
            ))}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 italic">
            &quot;{t.text}&quot;
          </p>
          
          <div className="flex justify-center gap-4">
            <button onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)} className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">←</button>
            <button onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)} className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}