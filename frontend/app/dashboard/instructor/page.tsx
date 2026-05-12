"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function InstructorDashboard() {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  
  // Form states for creating course
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    category: "Web Development",
    level: "beginner",
    thumbnail: "📚"
  });
  
  // Form states for adding lesson
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    video_url: "",
    duration: 600,
    is_preview: false,
    order_num: 1,
    courseId: ""
  });

  // Check if user is instructor
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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Get stats
        const statsRes = await fetch(`${API_URL}/instructor/stats`, { headers });
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
        }
        
        // Get courses
        const coursesRes = await fetch(`${API_URL}/instructor/my-courses`, { headers });
        const coursesData = await coursesRes.json();
        if (coursesData.success) {
          setCourses(coursesData.courses);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  // Create new course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/instructor/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
      const data = await response.json();
      
      if (data.success) {
        alert("✅ Course created successfully!");
        setShowCreateForm(false);
        setNewCourse({ title: "", description: "", price: 0, category: "Web Development", level: "beginner", thumbnail: "📚" });
        // Refresh courses
        window.location.reload();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to create course");
    }
  };

  // Add lesson to course
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/instructor/courses/${newLesson.courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newLesson)
      });
      const data = await response.json();
      
      if (data.success) {
        alert("✅ Lesson added successfully!");
        setShowLessonForm(null);
        setNewLesson({ title: "", description: "", video_url: "", duration: 600, is_preview: false, order_num: 1, courseId: "" });
        window.location.reload();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to add lesson");
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This will also delete all lessons and student progress.")) return;
    
    try {
      const response = await fetch(`${API_URL}/instructor/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        alert("✅ Course deleted successfully!");
        window.location.reload();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! 👋 Manage your courses and track your earnings.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
            <div className="text-gray-500">Total Courses</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-4xl mb-2">👨‍🎓</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
            <div className="text-gray-500">Total Students</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-2xl font-bold text-green-600">${stats.totalRevenue}</div>
            <div className="text-gray-500">Total Revenue</div>
          </div>
        </div>
        
        {/* Create Course Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            + Create New Course
          </button>
        </div>
        
        {/* Create Course Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Advanced React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="What will students learn?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({...newCourse, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set 0 for free course</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Programming</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Level</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail Emoji</label>
                  <input
                    type="text"
                    value={newCourse.thumbnail}
                    onChange={(e) => setNewCourse({...newCourse, thumbnail: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="📚"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Create Course
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Add Lesson Form */}
        {showLessonForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Add Lesson to Course</h2>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">YouTube Video URL</label>
                <input
                  type="text"
                  required
                  value={newLesson.video_url}
                  onChange={(e) => setNewLesson({...newLesson, video_url: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className="text-xs text-gray-500 mt-1">Use embed URL: https://www.youtube.com/embed/VIDEO_ID</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({...newLesson, duration: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order Number</label>
                  <input
                    type="number"
                    value={newLesson.order_num}
                    onChange={(e) => setNewLesson({...newLesson, order_num: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newLesson.is_preview}
                      onChange={(e) => setNewLesson({...newLesson, is_preview: e.target.checked})}
                    />
                    <span className="text-sm">Free Preview</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Add Lesson
                </button>
                <button type="button" onClick={() => setShowLessonForm(null)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* My Courses List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
            <p className="text-gray-500 text-sm">Manage your courses and add lessons</p>
          </div>
          
          {courses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">You haven't created any courses yet.</p>
              <button onClick={() => setShowCreateForm(true)} className="text-blue-600 hover:underline mt-2">
                Create your first course →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {courses.map((course: any) => (
                <div key={course.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{course.thumbnail || "📚"}</span>
                        <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                        {course.is_published ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Published</span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Draft</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>💰 ${course.price === 0 ? "FREE" : course.price}</span>
                        <span>👨‍🎓 {course.total_students || 0} students</span>
                        <span>💰 Revenue: ${course.total_revenue || 0}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/courses/${course.id}`} className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition" target="_blank">
                        View
                      </Link>
                      <button
                        onClick={() => {
                          setNewLesson({...newLesson, courseId: course.id});
                          setShowLessonForm(course.id);
                        }}
                        className="px-3 py-1 text-green-600 hover:bg-green-50 rounded transition"
                      >
                        + Lesson
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        Delete
                      </button>
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