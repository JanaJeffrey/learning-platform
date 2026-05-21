// app/dashboard/student/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Certificate {
  id: string;
  certificate_number: string;
  course_title: string;
  issued_at: string;
  downloaded_at: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

interface DashboardStats {
  totalCourses: number;
  completedLessons: number;
  totalLessons: number;
  averageProgress: number;
}

export default function StudentDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses"); // "courses" or "certificates"

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      // Fetch my courses
      const coursesRes = await fetch(`${API_URL}/dashboard/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const coursesData = await coursesRes.json();
      if (coursesData.success) setCourses(coursesData.courses);

      // Fetch certificates
      const certRes = await fetch(`${API_URL}/certificates/my-certificates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const certData = await certRes.json();
      if (certData.success) setCertificates(certData.certificates || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (certificateNumber: string) => {
    try {
      const response = await fetch(`${API_URL}/certificates/download/${certificateNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificate-${certificateNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Refresh to update downloaded_at
      fetchDashboardData();
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download certificate");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your learning progress and achievements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{stats?.totalCourses || 0}</div>
            <div className="text-sm opacity-90 mt-1">Courses Enrolled</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{stats?.completedLessons || 0}/{stats?.totalLessons || 0}</div>
            <div className="text-sm opacity-90 mt-1">Lessons Completed</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{stats?.averageProgress || 0}%</div>
            <div className="text-sm opacity-90 mt-1">Average Progress</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "courses"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "certificates"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Certificates ({certificates.length})
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            {courses.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Courses Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Start learning by enrolling in a course</p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Browse Courses
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                    {course.thumbnail && (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{course.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{course.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <Link
                        href={`/courses/${course.id}`}
                        className="block text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-md transition-all duration-300"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            {certificates.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="text-6xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Certificates Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Complete a course to earn your first certificate</p>
                <Link
                  href="/dashboard/student"
                  onClick={() => setActiveTab("courses")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  View My Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <div className="text-2xl mb-1">🎓</div>
                          <h3 className="font-bold text-lg">Certificate</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-white/80 text-xs">Certificate ID</div>
                          <div className="text-white text-sm font-mono">{cert.certificate_number}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">{cert.course_title}</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Issued: {new Date(cert.issued_at).toLocaleDateString()}</span>
                        </div>
                        {cert.downloaded_at && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Downloaded: {new Date(cert.downloaded_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDownloadCertificate(cert.certificate_number)}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}