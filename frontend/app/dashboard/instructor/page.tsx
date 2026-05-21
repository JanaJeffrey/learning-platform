// app/dashboard/instructor/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fetcher function for SWR
const fetcher = (url: string, token: string) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

export default function InstructorDashboard() {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    category: "Web Development",
    level: "beginner",
    thumbnail: "📚",
  });
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    video_url: "",
    duration: 600,
    is_preview: false,
    order_num: 1,
    courseId: "",
  });

  // Redirect if not instructor
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role !== "instructor") {
      router.push("/dashboard/student");
      return;
    }
  }, [isAuthenticated, user, router]);

  // SWR for stats – caches data, refetches only when needed
  const { data: statsData, error: statsError } = useSWR(
    token ? [`${API_URL}/instructor/stats`, token] : null,
    ([url, tkn]) => fetcher(url, tkn),
    {
      revalidateOnFocus: false,      // don't refetch when tab gains focus
      revalidateOnReconnect: false,  // don't refetch on network regain
      refreshInterval: 30000,        // refresh every 30s instead of every render
    }
  );

  // SWR for courses
  const { data: coursesData, error: coursesError, mutate } = useSWR(
    token ? [`${API_URL}/instructor/my-courses`, token] : null,
    ([url, tkn]) => fetcher(url, tkn),
    { revalidateOnFocus: false, revalidateOnReconnect: false, refreshInterval: 30000 }
  );

  const stats = statsData?.success ? statsData.stats : { totalCourses: 0, totalStudents: 0, totalRevenue: 0 };
  const courses = coursesData?.success ? coursesData.courses : [];

  // Create course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/instructor/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });
      const data = await response.json();
      if (data.success) {
        alert("✅ Course created!");
        setShowCreateForm(false);
        setNewCourse({ title: "", description: "", price: 0, category: "Web Development", level: "beginner", thumbnail: "📚" });
        mutate(); // refresh courses list
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to create course");
    }
  };

  // Add lesson
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/instructor/courses/${newLesson.courseId}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLesson),
      });
      const data = await response.json();
      if (data.success) {
        alert("✅ Lesson added!");
        setShowLessonForm(null);
        setNewLesson({ title: "", description: "", video_url: "", duration: 600, is_preview: false, order_num: 1, courseId: "" });
        mutate(); // refresh courses
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to add lesson");
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Delete this course and all lessons? This cannot be undone.")) return;
    try {
      const response = await fetch(`${API_URL}/instructor/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        alert("✅ Course deleted");
        mutate(); // refresh courses
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to delete course");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount * 1500);
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "advanced":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (!statsData && !statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, <span className="text-blue-600 dark:text-blue-400 font-medium">{user?.name}</span>! 👋 Manage your courses and track your earnings.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl">📚</div>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalCourses}</span>
              </div>
              <h3 className="text-gray-700 dark:text-gray-300 font-medium">Total Courses</h3>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Courses you've created</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-2xl">👨‍🎓</div>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalStudents}</span>
              </div>
              <h3 className="text-gray-700 dark:text-gray-300 font-medium">Total Students</h3>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Students enrolled</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-2xl">💰</div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(stats.totalRevenue)}</span>
              </div>
              <h3 className="text-gray-700 dark:text-gray-300 font-medium">Total Revenue</h3>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Lifetime earnings</p>
            </div>
          </div>
        </div>

        {/* Create Course Button */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Course
          </button>
        </div>

        {/* Create Course Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreateForm(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Course</h2>
                <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreateCourse} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
                  <input type="text" required value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea required value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (USD)</label>
                    <input type="number" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    <p className="text-xs text-gray-500 mt-1">0 = free</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>Web Development</option>
                      <option>Data Science</option>
                      <option>Programming</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                    <select value={newCourse.level} onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail Emoji</label>
                    <input type="text" value={newCourse.thumbnail} onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Create Course</button>
                  <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Lesson Modal */}
        {showLessonForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLessonForm(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Lesson</h2>
                <button onClick={() => setShowLessonForm(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddLesson} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lesson Title</label>
                  <input type="text" required value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea value={newLesson.description} onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube Embed URL</label>
                  <input type="text" required value={newLesson.video_url} onChange={(e) => setNewLesson({ ...newLesson, video_url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="https://www.youtube.com/embed/..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (sec)</label>
                    <input type="number" value={newLesson.duration} onChange={(e) => setNewLesson({ ...newLesson, duration: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                    <input type="number" value={newLesson.order_num} onChange={(e) => setNewLesson({ ...newLesson, order_num: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newLesson.is_preview} onChange={(e) => setNewLesson({ ...newLesson, is_preview: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Free Preview</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Add Lesson</button>
                  <button type="button" onClick={() => setShowLessonForm(null)} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Courses</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your courses and add lessons</p>
          </div>
          {courses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 dark:text-gray-400 mb-3">No courses yet.</p>
              <button onClick={() => setShowCreateForm(true)} className="text-blue-600 dark:text-blue-400 hover:underline">Create your first course →</button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {courses.map((course: any) => (
                <div key={course.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-3xl">{course.thumbnail || "📚"}</span>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{course.title}</h3>
                        {course.is_published ? (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">Published</span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">Draft</span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${getLevelBadge(course.level)}`}>{course.level}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">{formatCurrency(course.price)}</span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">{course.total_students || 0} students</span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">{course.total_duration || 0} hours</span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">{course.total_revenue ? formatCurrency(course.total_revenue) : "₦0"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/courses/${course.id}`} className="px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">View</Link>
                      <button onClick={() => { setNewLesson({ ...newLesson, courseId: course.id }); setShowLessonForm(course.id); }} className="px-3 py-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg">+ Lesson</button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}