"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ManageCoursesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "instructor") {
      router.push("/dashboard/student");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Manage Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page is under construction. Please use the Instructor Dashboard to manage your courses.
          </p>
          <button
            onClick={() => router.push("/dashboard/instructor")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}