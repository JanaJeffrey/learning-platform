"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Realistic stats for each course
const courseStatsMap: Record<string, { rating: number; reviews: number; students: number }> = {
  "Complete Web Development": { rating: 5.0, reviews: 342, students: 1245 },
  "JavaScript Mastery": { rating: 4.5, reviews: 256, students: 987 },
  "React & Next.js": { rating: 5.0, reviews: 423, students: 1567 },
  "Advanced Python": { rating: 4.5, reviews: 234, students: 892 },
  "Machine Learning A-Z": { rating: 5.0, reviews: 567, students: 2103 },
  "UI/UX Design": { rating: 4.0, reviews: 189, students: 734 },
};

const getCourseStats = (title: string) => {
  return courseStatsMap[title] || { rating: 4.5, reviews: 150, students: 500 };
};

const getPriceInNaira = (priceInDollars: number) => {
  if (priceInDollars === 0) return 0;
  return priceInDollars * 1500;
};

const formatNaira = (amount: number) => {
  if (amount === 0) return 'Free';
  return `₦${amount.toLocaleString()}`;
};

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          return <span key={star} className="text-amber-500 text-sm">★</span>;
        } else if (star === fullStars + 1 && hasHalfStar) {
          return (
            <div key={star} className="relative inline-block text-sm">
              <span className="text-gray-300 dark:text-gray-600">★</span>
              <span className="absolute top-0 left-0 overflow-hidden text-amber-500" style={{ width: '50%' }}>
                ★
              </span>
            </div>
          );
        } else {
          return <span key={star} className="text-gray-300 dark:text-gray-600 text-sm">☆</span>;
        }
      })}
    </div>
  );
};

const formatStudentCount = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

export default function PopularCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`);
        const data = await response.json();
        if (data.success && data.courses) {
          const coursesWithStats = data.courses.slice(0, 4).map((course: any) => {
            const stats = getCourseStats(course.title);
            return {
              ...course,
              rating: stats.rating,
              reviewCount: stats.reviews,
              studentCount: stats.students,
              nairaPrice: getPriceInNaira(course.price),
            };
          });
          setCourses(coursesWithStats);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Most Popular Courses
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    // ✅ FIXED: Section background - DARK in dark mode
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Popular Choices
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
            Most Popular Courses
          </h2>
          <div className="w-20 h-1 bg-indigo-600 dark:bg-indigo-400 mx-auto rounded-full"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-5 max-w-2xl mx-auto">
            Hand-picked top-rated courses loved by thousands of students
          </p>
        </div>

        {/* Courses Grid - Cards now have proper dark mode backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {courses.map((course: any, index: number) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 block"
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${
                index === 0 ? "from-indigo-500 to-indigo-600" :
                index === 1 ? "from-blue-500 to-blue-600" :
                index === 2 ? "from-slate-500 to-slate-600" :
                "from-gray-500 to-gray-600"
              }`}></div>
              
              {/* Course Image/Icon Area */}
              <div className="pt-6 pb-2 px-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-700 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {course.thumbnail || "📚"}
                  </div>
                  
                  {/* Price Badge */}
                  {course.nairaPrice === 0 ? (
                    <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                      Free
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                      {formatNaira(course.nairaPrice)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="px-5 pb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
                
                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-medium shadow-sm">
                    {course.instructorId?.name?.charAt(0) || "P"}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {course.instructorId?.name || "Expert Instructor"}
                  </span>
                </div>
                
                {/* Star Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={course.rating} />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{course.rating}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">({course.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>
                
                {/* Stats Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zM9 6h2v5H9V6zm0 7h2v2H9v-2z"/>
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{course.totalDuration || 30} hours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8v2a2 2 0 01-2 2h-2v-2a4 4 0 00-8 0v2H4a2 2 0 01-2-2V8a8 8 0 1116 0zM10 18a8 8 0 100-16 8 8 0 000 16z"/>
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatStudentCount(course.studentCount)} students</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-14">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl font-medium hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:hover:bg-indigo-600 dark:hover:border-indigo-600 transition-all duration-300"
          >
            <span>Explore All Courses</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}