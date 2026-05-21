"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Realistic stats for each course (using whole numbers + .0 for clean stars)
const courseStatsMap: Record<string, { rating: number; reviews: number; students: number }> = {
  "Complete Web Development": { rating: 5.0, reviews: 342, students: 1245 },
  "JavaScript Mastery": { rating: 4.5, reviews: 256, students: 987 },
  "React & Next.js": { rating: 5.0, reviews: 423, students: 1567 },
  "Advanced Python": { rating: 4.5, reviews: 234, students: 892 },
  "Machine Learning A-Z": { rating: 5.0, reviews: 567, students: 2103 },
  "UI/UX Design": { rating: 4.0, reviews: 189, students: 734 },
};

// Get course stats
const getCourseStats = (title: string) => {
  return courseStatsMap[title] || { rating: 4.5, reviews: 150, students: 500 };
};

// Nigerian Naira conversion
const getPriceInNaira = (priceInDollars: number) => {
  if (priceInDollars === 0) return 0;
  return priceInDollars * 1500;
};

const formatNaira = (amount: number) => {
  if (amount === 0) return 'Free';
  return `₦${amount.toLocaleString()}`;
};

// Professional star rating component - CLEAN AND VISIBLE
const StarRating = ({ rating }: { rating: number }) => {
  // Round to nearest half for display
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

// Format student count
const formatStudentCount = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

// Get course image
const getCourseImage = (title: string) => {
  const imageMap: Record<string, string> = {
    "Complete Web Development": "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?w=400&h=240&fit=crop",
    "JavaScript Mastery": "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?w=400&h=240&fit=crop",
    "React & Next.js": "https://images.pexels.com/photos/177598/pexels-photo-177598.jpeg?w=400&h=240&fit=crop",
    "Advanced Python": "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?w=400&h=240&fit=crop",
    "Machine Learning A-Z": "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?w=400&h=240&fit=crop",
    "UI/UX Design": "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=400&h=240&fit=crop",
  };
  return imageMap[title] || "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?w=400&h=240&fit=crop";
};

const getCategoryColor = (title: string) => {
  const colorMap: Record<string, string> = {
    "Complete Web Development": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "JavaScript Mastery": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    "React & Next.js": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    "Advanced Python": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    "Machine Learning A-Z": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    "UI/UX Design": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  };
  return colorMap[title] || "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300";
};

export default function CoursesPage() {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

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
          const coursesWithStats = data.courses.map((course: any) => {
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
  }, [token]);

  const categories = ["all", ...new Set(courses.map((c: any) => c.category))];
  const levels = ["all", "beginner", "intermediate", "advanced"];

  const filteredCourses = courses
    .filter((course: any) => {
      const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      const matchesPrice = priceFilter === "all" || 
                          (priceFilter === "free" && course.price === 0) ||
                          (priceFilter === "paid" && course.price > 0);
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return (b.studentCount || 0) - (a.studentCount || 0);
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 pt-2">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-8">
          {user && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
              Welcome back, {user.name?.split(' ')[0]}! 👋
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Courses to get you started
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore courses from top instructors around the world
          </p>
        </div>
        
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
          
          <div className="flex flex-wrap gap-3 items-center justify-between">
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
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredCourses.length} courses
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
        
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLevel("all");
                setPriceFilter("all");
              }}
              className="mt-4 px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={getCourseImage(course.title)}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?w=400&h=240&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {course.price === 0 ? (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full shadow-md">
                      FREE
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-md">
                      {formatNaira(course.nairaPrice)}
                    </div>
                  )}
                  
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    {course.level || "Beginner"}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${getCategoryColor(course.title)}`}>
                    {course.category || "Course"}
                  </div>
                  
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {course.instructorId?.name || "Expert Instructor"}
                  </p>
                  
                  {/* Star Rating - Clean and visible */}
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={course.rating} />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{course.rating}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">({course.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.totalDuration || 30} hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{formatStudentCount(course.studentCount)} students</span>
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