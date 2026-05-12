// ============================================
// API UTILITY FILE - Handles all backend communication
// ============================================
// Think of this as your "phone" to call the backend
// Every time you need data, you use these functions

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ============================================
// HELPER FUNCTION FOR MAKING API CALLS
// ============================================
// This is like a "universal remote" - works for all API calls

async function apiCall(
  endpoint: string,
  method: string = "GET",
  data?: any,
  token?: string
) {
  // Prepare headers (like putting a stamp on an envelope)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // If we have a token, add it to headers (for authentication)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Configure the request
  const config: RequestInit = {
    method,
    headers,
  };

  // If we have data to send (like a new course), attach it
  if (data) {
    config.body = JSON.stringify(data);
  }

  // MAKE THE ACTUAL API CALL!
  const response = await fetch(`${API_URL}${endpoint}`, config);
  const responseData = await response.json();

  // If something went wrong, throw an error
  if (!response.ok) {
    throw new Error(responseData.message || "Something went wrong");
  }

  return responseData;
}

// ============================================
// AUTHENTICATION API CALLS
// ============================================

export async function login(email: string, password: string) {
  return apiCall("/auth/login", "POST", { email, password });
}

export async function register(name: string, email: string, password: string, role: string) {
  return apiCall("/auth/register", "POST", { name, email, password, role });
}

// ============================================
// COURSE API CALLS
// ============================================

// Get all courses (for the courses listing page)
export async function getAllCourses(token?: string) {
  return apiCall("/courses", "GET", undefined, token);
}

// Get a single course by ID (for the course detail page)
export async function getCourseById(courseId: string, token?: string) {
  return apiCall(`/courses/${courseId}`, "GET", undefined, token);
}

// Enroll in a course (when user clicks "Enroll Now")
export async function enrollInCourse(courseId: string, token: string) {
  return apiCall("/enroll", "POST", { courseId }, token);
}

// Check if user is enrolled in a course
export async function checkEnrollment(courseId: string, token: string) {
  return apiCall(`/enroll/check/${courseId}`, "GET", undefined, token);
}

// ============================================
// LESSON API CALLS
// ============================================

// Get a single lesson by ID (for the video player)
export async function getLesson(lessonId: string, token: string) {
  return apiCall(`/lessons/${lessonId}`, "GET", undefined, token);
}

// Get all lessons for a course
export async function getCourseLessons(courseId: string, token: string) {
  return apiCall(`/courses/${courseId}/lessons`, "GET", undefined, token);
}

// ============================================
// PROGRESS API CALLS
// ============================================

// Update progress when user watches a lesson
export async function updateProgress(lessonId: string, watchedDuration: number, token: string) {
  return apiCall("/progress", "POST", { lessonId, watchedDuration }, token);
}

// Get student's progress for all courses
export async function getStudentProgress(token: string) {
  return apiCall("/progress/my-progress", "GET", undefined, token);
}

// Get progress for a specific course
export async function getCourseProgress(courseId: string, token: string) {
  return apiCall(`/progress/course/${courseId}`, "GET", undefined, token);
}

// ============================================
// INSTRUCTOR API CALLS
// ============================================

// Create a new course (instructor only)
export async function createCourse(courseData: any, token: string) {
  return apiCall("/courses", "POST", courseData, token);
}

// Add a lesson to a course (instructor only)
export async function addLesson(courseId: string, lessonData: any, token: string) {
  return apiCall(`/courses/${courseId}/lessons`, "POST", lessonData, token);
}

// Get all courses created by the instructor
export async function getInstructorCourses(token: string) {
  return apiCall("/courses/instructor/my-courses", "GET", undefined, token);
}

// Update course details
export async function updateCourse(courseId: string, courseData: any, token: string) {
  return apiCall(`/courses/${courseId}`, "PUT", courseData, token);
}

// Delete a course
export async function deleteCourse(courseId: string, token: string) {
  return apiCall(`/courses/${courseId}`, "DELETE", undefined, token);
}