// ============================================
// INSTRUCTOR CONTROLLER
// ============================================
// This file contains the logic for all instructor actions
// Think of it as the "brain" that handles:
// - Getting instructor's courses
// - Creating/updating/deleting courses
// - Adding/updating/deleting lessons

const db = require('../config/database'); // We'll set this up

// ============================================
// GET INSTRUCTOR'S COURSES
// ============================================
// Returns all courses created by the logged-in instructor
// Used on the dashboard to display "My Courses" list
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;
    
    // SQL query: Get all courses where instructorId matches
    const courses = await db.all(`
      SELECT c.*, 
        COUNT(DISTINCT e.user_id) as total_students,
        SUM(CASE WHEN c.price > 0 THEN e.amount_paid ELSE 0 END) as total_revenue
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.instructor_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [instructorId]);
    
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// GET INSTRUCTOR STATS
// ============================================
// Returns summary numbers for the dashboard cards
// Example: total courses, total students, total revenue
exports.getInstructorStats = async (req, res) => {
  try {
    const instructorId = req.user.id;
    
    const stats = await db.get(`
      SELECT 
        COUNT(DISTINCT c.id) as total_courses,
        COUNT(DISTINCT e.user_id) as total_students,
        SUM(CASE WHEN c.price > 0 THEN COALESCE(e.amount_paid, 0) ELSE 0 END) as total_revenue
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.instructor_id = ?
    `, [instructorId]);
    
    res.json({ 
      success: true, 
      stats: {
        totalCourses: stats.total_courses || 0,
        totalStudents: stats.total_students || 0,
        totalRevenue: stats.total_revenue || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// CREATE A NEW COURSE
// ============================================
// Called when instructor submits the "Create Course" form
// Creates a new course record in the database
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, category, level, thumbnail } = req.body;
    const instructorId = req.user.id;
    const courseId = Date.now().toString(); // Simple unique ID
    
    await db.run(`
      INSERT INTO courses (id, title, description, price, category, level, thumbnail, instructor_id, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [courseId, title, description, price, category, level, thumbnail, instructorId, false, new Date().toISOString()]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Course created successfully',
      courseId 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// UPDATE A COURSE
// ============================================
// Edit course details like title, price, description
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, price, category, level, thumbnail, is_published } = req.body;
    const instructorId = req.user.id;
    
    // First, verify this course belongs to the instructor
    const course = await db.get('SELECT * FROM courses WHERE id = ? AND instructor_id = ?', [courseId, instructorId]);
    if (!course) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this course' });
    }
    
    await db.run(`
      UPDATE courses 
      SET title = ?, description = ?, price = ?, category = ?, level = ?, thumbnail = ?, is_published = ?
      WHERE id = ?
    `, [title, description, price, category, level, thumbnail, is_published, courseId]);
    
    res.json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// DELETE A COURSE
// ============================================
// Removes a course and all its lessons
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user.id;
    
    // Verify ownership
    const course = await db.get('SELECT * FROM courses WHERE id = ? AND instructor_id = ?', [courseId, instructorId]);
    if (!course) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }
    
    // Delete all lessons first (foreign key constraint)
    await db.run('DELETE FROM lessons WHERE course_id = ?', [courseId]);
    // Delete all enrollments
    await db.run('DELETE FROM enrollments WHERE course_id = ?', [courseId]);
    // Delete the course
    await db.run('DELETE FROM courses WHERE id = ?', [courseId]);
    
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ADD A LESSON TO A COURSE
// ============================================
// Called when instructor adds a new video lesson
exports.addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, video_url, duration, is_preview, order_num } = req.body;
    const instructorId = req.user.id;
    
    // Verify course belongs to this instructor
    const course = await db.get('SELECT * FROM courses WHERE id = ? AND instructor_id = ?', [courseId, instructorId]);
    if (!course) {
      return res.status(403).json({ success: false, message: 'Not authorized to add lessons to this course' });
    }
    
    const lessonId = `l${Date.now()}`;
    
    await db.run(`
      INSERT INTO lessons (id, course_id, title, description, video_url, duration, order_num, is_preview)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [lessonId, courseId, title, description, video_url, duration, order_num, is_preview ? 1 : 0]);
    
    res.status(201).json({ success: true, message: 'Lesson added successfully', lessonId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// UPDATE A LESSON
// ============================================
// Edit lesson details
exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, description, video_url, duration, is_preview, order_num } = req.body;
    const instructorId = req.user.id;
    
    // Verify this lesson belongs to instructor's course
    const lesson = await db.get(`
      SELECT l.* FROM lessons l
      JOIN courses c ON l.course_id = c.id
      WHERE l.id = ? AND c.instructor_id = ?
    `, [lessonId, instructorId]);
    
    if (!lesson) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this lesson' });
    }
    
    await db.run(`
      UPDATE lessons 
      SET title = ?, description = ?, video_url = ?, duration = ?, order_num = ?, is_preview = ?
      WHERE id = ?
    `, [title, description, video_url, duration, order_num, is_preview ? 1 : 0, lessonId]);
    
    res.json({ success: true, message: 'Lesson updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// DELETE A LESSON
// ============================================
// Remove a lesson from a course
exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const instructorId = req.user.id;
    
    // Verify ownership
    const lesson = await db.get(`
      SELECT l.* FROM lessons l
      JOIN courses c ON l.course_id = c.id
      WHERE l.id = ? AND c.instructor_id = ?
    `, [lessonId, instructorId]);
    
    if (!lesson) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this lesson' });
    }
    
    await db.run('DELETE FROM lessons WHERE id = ?', [lessonId]);
    await db.run('DELETE FROM progress WHERE lesson_id = ?', [lessonId]);
    
    res.json({ success: true, message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};