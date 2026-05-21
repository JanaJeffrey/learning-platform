"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ============================================
// REAL VIDEO URLS - Updated with actual ML content
// ============================================

const videoUrls: Record<string, string> = {
  // Web Development Course (course 1)
  'l1': 'https://www.youtube.com/embed/ysEN5RaKOlA',
  'l2': 'https://www.youtube.com/embed/kUMe1FH4CHE',
  'l3': 'https://www.youtube.com/embed/1Rs2ND1ryYc',
  'l4': 'https://www.youtube.com/embed/PkZNo7MFNFg',
  'l5': 'https://www.youtube.com/embed/l1mEResb9eY',
  
  // ==========================================
  // MACHINE LEARNING COURSE (REAL VIDEOS)
  // ==========================================
  'l6': 'https://www.youtube.com/embed/ukzFI9rgwfU',
  'l7': 'https://www.youtube.com/embed/7eh4d6sabA0',
  'l8': 'https://www.youtube.com/embed/EtoNMHCCGug',
  'l9': 'https://www.youtube.com/embed/aircAruvnKk',
  
  // Python Course
  'l10': 'https://www.youtube.com/embed/rfscVS0vtbw',
  'l11': 'https://www.youtube.com/embed/_uQrJ0TkZlc',
  'l12': 'https://www.youtube.com/embed/9Os0o3wzS_I',
  
  // UI/UX Design
  'l13': 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
  'l14': 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
  'l15': 'https://www.youtube.com/embed/KB8eua2NkNI',
  
  // React & Next.js
  'l16': 'https://www.youtube.com/embed/w7ejDZ8SWv8',
  'l17': 'https://www.youtube.com/embed/dpw9EHDh2bM',
  'l18': 'https://www.youtube.com/embed/QaSxLge9Gic',
  'l19': 'https://www.youtube.com/embed/OhMDrkAyaGk',
  
  // JavaScript Mastery
  'l20': 'https://www.youtube.com/embed/W6NZfCO5SIk',
  'l21': 'https://www.youtube.com/embed/PkZNo7MFNFg',
  'l22': 'https://www.youtube.com/embed/2Zo_3-E4B6Y',
  'l23': 'https://www.youtube.com/embed/ivdTnPlGND8',
};

const FALLBACK_VIDEO = 'https://www.youtube.com/embed/ysEN5RaKOlA';

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className={`${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        {type === 'success' ? '✅' : '❌'}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">✕</button>
      </div>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  
  const { isAuthenticated, token } = useAuth();
  
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/lessons/${lessonId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          setLesson(data.lesson);
        } else {
          setError(data.message || "Lesson not found");
        }
      } catch (err) {
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    if (token && lessonId) {
      fetchLesson();
    }
  }, [lessonId, token]);

  const markComplete = async () => {
    // Add guard to prevent errors if lesson isn't loaded yet
    if (!lesson) return;

    try {
      const response = await fetch(`${API_URL}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // ✅ FIX: Use actual lesson duration, not hardcoded 300
        body: JSON.stringify({ lessonId, watchedDuration: lesson.duration })
      });
      const data = await response.json();
      
      if (data.success) {
        setIsCompleted(true);
        setToast({ message: "🎉 Lesson Completed! Great job!", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to mark complete", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Failed to mark complete. Please try again.", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "You don't have access to this lesson"}</p>
          <Link href={`/courses/${courseId}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const videoUrl = videoUrls[lessonId] || FALLBACK_VIDEO;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Video Player */}
        <div className="bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="relative w-full aspect-video">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={videoUrl}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
        
        {/* Lesson Info */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <Link href={`/courses/${courseId}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
              ← Back to Course
            </Link>
            
            {!isCompleted ? (
              <button
                onClick={markComplete}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
              >
                Mark as Complete
              </button>
            ) : (
              <span className="px-4 py-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
                ✅ Completed
              </span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {lesson.title}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {lesson.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
            <span>Duration: {Math.floor(lesson.duration / 60)} minutes</span>
            <span>Course: {lesson.course_title}</span>
          </div>
          
          {isCompleted && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-500/20 border border-green-500 rounded-lg">
              <p className="text-green-700 dark:text-green-400">✅ Lesson completed! Great job!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}