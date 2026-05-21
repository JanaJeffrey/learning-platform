"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper functions
const getPriceInNaira = (priceInDollars: number) => {
  if (priceInDollars === 0) return 0;
  return priceInDollars * 1500;
};

const formatNaira = (amount: number) => {
  if (amount === 0) return 'Free';
  return `₦${amount.toLocaleString()}`;
};

const formatStudentCount = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
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

export default function PopularCourses() {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all published courses
        const response = await fetch(`${API_URL}/courses`);
        const data = await response.json();
        let topCourses = [];
        if (data.success && data.courses) {
          // Sort by enrolled_students (or average_rating) descending and take first 4
          topCourses = data.courses
            .sort((a: any, b: any) => (b.enrolled_students || 0) - (a.enrolled_students || 0))
            .slice(0, 4);
          setCourses(topCourses);
        }

        // If user is logged in, fetch their progress for these courses
        if (token && topCourses.length > 0) {
          const progressRes = await fetch(`${API_URL}/dashboard/my-courses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const progressData = await progressRes.json();
          if (progressData.success && progressData.courses) {
            const progressMap: Record<string, number> = {};
            progressData.courses.forEach((c: any) => {
              progressMap[c.id] = c.progress_percentage || 0;
            });
            setUserProgress(progressMap);
          }
        }
      } catch (error) {
        console.error("Error fetching popular courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

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
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {courses.map((course: any, index: number) => {
            const progress = userProgress[course.id] || 0;
            const isEnrolled = progress > 0;

            return (
              <div
                key={course.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400"
              >
                <div className={`h-1 w-full bg-gradient-to-r ${
                  index === 0 ? "from-indigo-500 to-indigo-600" :
                  index === 1 ? "from-blue-500 to-blue-600" :
                  index === 2 ? "from-slate-500 to-slate-600" :
                  "from-gray-500 to-gray-600"
                }`}></div>
                
                <div className="pt-6 pb-2 px-5">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-700 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {course.thumbnail || "📚"}
                    </div>
                    
                    {course.price === 0 ? (
                      <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                        Free
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                        {formatNaira(getPriceInNaira(course.price))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-5 pb-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-medium shadow-sm">
                      {course.instructor_id?.name?.charAt(0) || "P"}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {course.instructor_id?.name || "Expert Instructor"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <StarRating rating={course.average_rating || 4.5} />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {course.average_rating?.toFixed(1) || "4.5"}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({course.total_reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zM9 6h2v5H9V6zm0 7h2v2H9v-2z"/>
                      </svg>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{course.total_duration || 30} hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8v2a2 2 0 01-2 2h-2v-2a4 4 0 00-8 0v2H4a2 2 0 01-2-2V8a8 8 0 1116 0zM10 18a8 8 0 100-16 8 8 0 000 16z"/>
                      </svg>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatStudentCount(course.enrolled_students || 0)} students
                      </span>
                    </div>
                  </div>

                  {/* Progress bar and button for enrolled users */}
                  {isEnrolled && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                        <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      <Link
                        href={`/courses/${course.id}`}
                        className="block text-center text-sm bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                      >
                        Continue {progress > 0 ? `(${progress}%)` : ''}
                      </Link>
                    </div>
                  )}

                  {!isEnrolled && (
                    <Link
                      href={`/courses/${course.id}`}
                      className="block text-center text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition mt-4"
                    >
                      View Course
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
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