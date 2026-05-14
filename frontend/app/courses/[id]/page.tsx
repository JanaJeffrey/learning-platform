"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ReviewsSection from "@/components/courses/ReviewsSection";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Beautiful background images for different course categories
const getHeroBackground = (category: string) => {
  const backgrounds: Record<string, string> = {
    "Web Development": "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?w=1600&h=400&fit=crop",
    "Programming": "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?w=1600&h=400&fit=crop",
    "Data Science": "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?w=1600&h=400&fit=crop",
    "Design": "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?w=1600&h=400&fit=crop",
    "Marketing": "https://images.pexels.com/photos/1432883/pexels-photo-1432883.jpeg?w=1600&h=400&fit=crop",
    "Business": "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?w=1600&h=400&fit=crop",
  };
  return backgrounds[category] || "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?w=1600&h=400&fit=crop";
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const { isAuthenticated, token, user } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        
        const headers: any = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/courses/${courseId}`, { headers });
        const data = await response.json();
        
        if (data.success) {
          setCourse(data.course);
          setIsEnrolled(data.course.isEnrolled || false);
        } else {
          setError(data.message || "Course not found");
        }
      } catch (err) {
        setError("Failed to load course. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, token]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      setEnrolling(true);
      const response = await fetch(`${API_URL}/enroll`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsEnrolled(true);
        alert("Successfully enrolled! 🎉 You now have full access to this course.");
        window.location.reload();
      } else {
        alert(data.message || "Enrollment failed");
      }
    } catch (error) {
      alert("Failed to enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The course you're looking for doesn't exist or may have been removed."}
          </p>
          <Link 
            href="/courses" 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  const isFreeCourse = course.price === 0;
  const hasAccess = isFreeCourse || isEnrolled;
  const previewLessons = course.lessons?.filter((l: any) => l.is_preview === 1) || [];
  const allLessons = course.lessons || [];

  const averageRating = course.average_rating || 0;
  const totalReviews = course.total_reviews || 0;
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating - fullStars >= 0.5;

  const heroBackground = getHeroBackground(course.category);

  return (
    // REMOVED pt-20 to eliminate blank space - navbar padding is handled by the hero section
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* ============================================
          HERO SECTION - Beautiful Background Image
          ============================================ */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Side - Course Info */}
            <div className="lg:col-span-2">
              {/* Category Badge */}
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 border border-white/20 mb-5">
                {course.category || "Course"}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {course.title}
              </h1>
              
              {/* Description */}
              <p className="text-lg text-white/80 mb-6 max-w-xl leading-relaxed">
                {course.description}
              </p>
              
              {/* Stats Row */}
              <div className="flex flex-wrap gap-5 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className={star <= fullStars ? "text-yellow-400" : star === fullStars + 1 && hasHalfStar ? "text-yellow-400" : "text-white/30"}>
                        {star <= fullStars ? "★" : star === fullStars + 1 && hasHalfStar ? "½" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span>{averageRating.toFixed(1)}</span>
                  <span>({totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👨‍🎓</span>
                  <span>{course.enrolledStudents || 0} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>{course.totalDuration || 40} hours</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Glass Morphism Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                {/* Price */}
                <div className="text-4xl font-bold text-white mb-4">
                  {course.price === 0 ? "FREE" : `$${course.price}`}
                </div>
                
                {/* CTA Button */}
                {hasAccess ? (
                  <Link
                    href={course.lessons?.length > 0 ? `/courses/${courseId}/lessons/${course.lessons[0].id}` : "#"}
                    className="block w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold text-center hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    {isFreeCourse ? "🎉 Start Learning Free →" : "Continue Learning →"}
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {enrolling ? "Enrolling..." : `Enroll Now - $${course.price}`}
                  </button>
                )}
                
                {/* Course Includes */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <h3 className="font-semibold mb-3 text-white/90">This course includes:</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">🎥 {course.lessons?.length || 0} video lessons</li>
                    <li className="flex items-center gap-2">📱 Access on mobile and TV</li>
                    <li className="flex items-center gap-2">🎓 Certificate of completion</li>
                    <li className="flex items-center gap-2">💬 Full lifetime access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ============================================
          TABS SECTION - Clean Modern Design
          ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs Navigation */}
        <div className="flex gap-8 border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-1 font-semibold text-base transition-all duration-200 ${
              activeTab === "overview"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`pb-4 px-1 font-semibold text-base transition-all duration-200 ${
              activeTab === "curriculum"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Curriculum ({course.lessons?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 px-1 font-semibold text-base transition-all duration-200 ${
              activeTab === "reviews"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Reviews ({totalReviews})
          </button>
        </div>
        
        {/* Tabs Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Course</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {course.longDescription || course.description}
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Instructor</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl text-white shadow-lg">
                    👨‍🏫
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Expert Instructor</h3>
                    <p className="text-gray-500 dark:text-gray-400">Expert in {course.category}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "curriculum" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Curriculum</h2>
              
              {!hasAccess && !isFreeCourse && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <p className="text-yellow-800 dark:text-yellow-300">
                    🔒 You need to <button onClick={handleEnroll} className="font-semibold underline">enroll</button> to access all lessons.
                    {previewLessons.length > 0 && " Below are preview lessons you can watch for free."}
                  </p>
                </div>
              )}
              
              {!course.lessons || course.lessons.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-12">Lessons coming soon!</p>
              ) : (
                <div className="space-y-3">
                  {(hasAccess || isFreeCourse ? allLessons : previewLessons).map((lesson: any, index: number) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                        hasAccess || isFreeCourse || lesson.is_preview === 1
                          ? "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" 
                          : "bg-gray-100 dark:bg-gray-800 opacity-60"
                      }`}
                      onClick={() => {
                        if (hasAccess || isFreeCourse || lesson.is_preview === 1) {
                          router.push(`/courses/${courseId}/lessons/${lesson.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                          {index + 1}
                        </div>
                        <div>
                          <p className={`font-medium ${hasAccess || isFreeCourse || lesson.is_preview === 1 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-500"}`}>
                            {lesson.title}
                            {lesson.is_preview === 1 && !hasAccess && !isFreeCourse && (
                              <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">Preview</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                        </span>
                        {(hasAccess || isFreeCourse || lesson.is_preview === 1) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/courses/${courseId}/lessons/${lesson.id}`);
                            }}
                            className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition"
                          >
                            Watch
                          </button>
                        )}
                        {!hasAccess && !isFreeCourse && lesson.is_preview !== 1 && (
                          <span className="px-3 py-1 text-sm text-gray-400 dark:text-gray-600">🔒 Locked</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!hasAccess && !isFreeCourse && (
                <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl text-center">
                  <p className="text-blue-800 dark:text-blue-300 mb-3">Want to access all {course.lessons?.length || 0} lessons?</p>
                  <button
                    onClick={handleEnroll}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Enroll Now - ${course.price}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "reviews" && (
            <ReviewsSection 
              courseId={courseId} 
              isEnrolled={isEnrolled}
              onReviewAdded={() => {
                window.location.reload();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}