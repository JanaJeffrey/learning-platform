"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Professional gradient colors for card top (Coursera style - subtle, elegant)
const cardGradients = [
  "from-slate-700 to-slate-800",
  "from-gray-700 to-gray-800", 
  "from-stone-700 to-stone-800",
  "from-neutral-700 to-neutral-800",
];

export default function CoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const headers: any = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_URL}/courses`, { headers });
        const data = await response.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  const categories = ["all", ...new Set(courses.map((c: any) => c.category))];
  const levels = ["all", "beginner", "intermediate", "advanced"];

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesPrice = priceFilter === "all" || 
                        (priceFilter === "free" && course.price === 0) ||
                        (priceFilter === "paid" && course.price > 0);
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  // Helper to get gradient based on course id
  const getGradient = (id: string) => {
    const index = parseInt(id) % cardGradients.length;
    return cardGradients[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header - Coursera style */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Courses to get you started
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Explore courses from top instructors around the world
          </p>
        </div>
        
        {/* Search and Filters - Clean design */}
        <div className="mb-8">
          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level === "all" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredCourses.length} results
          </p>
        </div>
        
        {/* Courses Grid - COURSERA STYLE CARDS */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course: any, idx: number) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 block border border-gray-100 dark:border-gray-700"
              >
                {/* Card Image Area - Professional gradient (like Coursera's thumbnails) */}
                <div className={`relative h-36 bg-gradient-to-r ${getGradient(course.id)} overflow-hidden`}>
                  {/* Course icon */}
                  <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30 group-hover:scale-110 transition-transform duration-300">
                    {course.thumbnail || "📚"}
                  </div>
                  {/* Price badge overlay */}
                  {course.price === 0 ? (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded">
                      FREE
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                      ${course.price}
                    </div>
                  )}
                </div>
                
                {/* Card Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  
                  {/* Instructor */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {course.instructorId?.name || "Expert Instructor"}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      <span className="text-amber-500 text-sm">★★★★★</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">4.8</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">(2.3k)</span>
                  </div>
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.totalDuration || 30} hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.level || "Beginner"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}