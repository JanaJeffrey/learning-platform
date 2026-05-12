"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function StudentDashboard() {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();
  
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, averageProgress: 0, completedLessons: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const coursesRes = await fetch(`${API_URL}/dashboard/my-courses`, { headers });
        const coursesData = await coursesRes.json();
        if (coursesData.success) setCourses(coursesData.courses);
        
        const statsRes = await fetch(`${API_URL}/dashboard/stats`, { headers });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
        
        const activityRes = await fetch(`${API_URL}/dashboard/recent-activity`, { headers });
        const activityData = await activityRes.json();
        if (activityData.success) setActivities(activityData.activities);
        
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthenticated, token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {user?.name?.split(" ")[0] || "Student"}!
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning progress and continue where you left off.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</div>
            <div className="text-gray-500 dark:text-gray-400">Courses Enrolled</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageProgress}%</div>
            <div className="text-gray-500 dark:text-gray-400">Average Progress</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedLessons}</div>
            <div className="text-gray-500 dark:text-gray-400">Lessons Completed</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Courses</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Continue where you left off</p>
          </div>
          
          {courses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">You haven't enrolled in any courses yet.</p>
              <Link href="/courses" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                Browse Courses →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {courses.map((course: any) => (
                <div key={course.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="text-4xl w-12">{course.thumbnail || "📚"}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{course.title}</h3>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">{course.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress_percentage || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {course.completed_lessons || 0} / {course.total_lessons || 0} lessons completed
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shrink-0"
                    >
                      Continue →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Your latest accomplishments</p>
          </div>
          
          {activities.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Start watching lessons to see activity here!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {activities.map((activity: any) => (
                <div key={activity.lesson_id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">✅</div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">
                        Completed <span className="font-semibold">"{activity.lesson_title}"</span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        in {activity.course_title}
                      </p>
                    </div>
                    <Link
                      href={`/courses/${activity.course_id}/lessons/${activity.lesson_id}`}
                      className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                    >
                      Rewatch →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {courses.length > 0 && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              💡 <span className="font-semibold">Pro Tip:</span> Watch 10 minutes daily to complete your courses faster!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}