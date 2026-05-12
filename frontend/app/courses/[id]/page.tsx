"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ReviewsSection from "@/components/courses/ReviewsSection";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                {course.category || "Course"}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-blue-100 mb-6">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className="text-yellow-400">
                        {star <= fullStars ? "★" : star === fullStars + 1 && hasHalfStar ? "½" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span>{averageRating.toFixed(1)}</span>
                  <span className="text-blue-200">({totalReviews} reviews)</span>
                </div>
                <div>•</div>
                <div>👨‍🎓 {course.enrolledStudents || 0} students</div>
                <div>•</div>
                <div>📚 {course.totalDuration || 40} hours</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <div className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {course.price === 0 ? "FREE" : `$${course.price}`}
              </div>
              
              {hasAccess ? (
                <Link
                  href={course.lessons?.length > 0 ? `/courses/${courseId}/lessons/${course.lessons[0].id}` : "#"}
                  className="block w-full py-3 bg-green-600 text-white rounded-lg font-semibold text-center hover:bg-green-700 transition-colors"
                >
                  {isFreeCourse ? "🎉 Start Learning Free →" : "Continue Learning →"}
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : `Enroll Now - $${course.price}`}
                </button>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">This course includes:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>🎥 {course.lessons?.length || 0} video lessons</li>
                  <li>📱 Access on mobile and TV</li>
                  <li>🎓 Certificate of completion</li>
                  <li>💬 Full lifetime access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-1 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`pb-4 px-1 font-medium transition-colors ${
                activeTab === "curriculum"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Curriculum ({course.lessons?.length || 0} lessons)
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 px-1 font-medium transition-colors ${
                activeTab === "reviews"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Reviews ({totalReviews})
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-800/30 p-6 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About This Course</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {course.longDescription || course.description}
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Instructor</h2>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">👨‍🏫</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Expert Instructor</h3>
                    <p className="text-gray-600 dark:text-gray-400">Expert in {course.category}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "curriculum" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Course Curriculum</h2>
              
              {!hasAccess && !isFreeCourse && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-300">
                    🔒 You need to <button onClick={handleEnroll} className="font-semibold underline">enroll</button> to access all lessons.
                    {previewLessons.length > 0 && " Below are preview lessons you can watch for free."}
                  </p>
                </div>
              )}
              
              {!course.lessons || course.lessons.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">Lessons coming soon!</p>
              ) : (
                <div className="space-y-3">
                  {(hasAccess || isFreeCourse ? allLessons : previewLessons).map((lesson: any, index: number) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
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
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 dark:text-gray-500 font-medium">#{index + 1}</span>
                        <div>
                          <p className={`font-medium ${hasAccess || isFreeCourse || lesson.is_preview === 1 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-500"}`}>
                            {lesson.title}
                            {lesson.is_preview === 1 && !hasAccess && !isFreeCourse && (
                              <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">(Preview)</span>
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
                            className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
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
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                  <p className="text-blue-800 dark:text-blue-300 mb-3">Want to access all {course.lessons?.length || 0} lessons?</p>
                  <button
                    onClick={handleEnroll}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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