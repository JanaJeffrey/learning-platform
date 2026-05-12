// ============================================
// USER TYPES
// ============================================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// ============================================
// COURSE TYPES
// ============================================

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  instructorId: string;
  instructorName?: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: Lesson[];
  totalDuration: number;
  enrolledStudents: number;
  createdAt: string;
  isPublished: boolean;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  videoUrl: string;
  videoDuration: number;
  order: number;
  isPreview: boolean;
  createdAt: string;
}

// ============================================
// ENROLLMENT & PROGRESS TYPES
// ============================================

export interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  isCompleted: boolean;
  completedAt?: string;
  progress: number; // 0-100 percentage
}

export interface Progress {
  _id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  isWatched: boolean;
  watchedDuration: number;
  lastWatchedAt: string;
  completedAt?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CoursesResponse {
  courses: Course[];
  totalPages: number;
  currentPage: number;
}

// ============================================
// INSTRUCTOR TYPES
// ============================================

export interface CourseUploadData {
  title: string;
  description: string;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
}

export interface LessonUploadData {
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  isPreview: boolean;
}