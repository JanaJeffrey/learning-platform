// ============================================
// COURSE ROUTES
// ============================================

const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  addLesson
} = require('../controllers/courseController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// ============================================
// PUBLIC ROUTES (anyone can access)
// ============================================

// GET /api/courses - Get all courses
router.get('/', getCourses);

// GET /api/courses/:id - Get single course
router.get('/:id', getCourseById);

// ============================================
// PROTECTED ROUTES (require login)
// ============================================

// All routes below this line require authentication
router.use(protect);

// GET /api/courses/instructor/my-courses - Get instructor's courses
router.get('/instructor/my-courses', getInstructorCourses);

// POST /api/courses - Create a new course
router.post('/', createCourse);

// PUT /api/courses/:id - Update a course
router.put('/:id', updateCourse);

// DELETE /api/courses/:id - Delete a course
router.delete('/:id', deleteCourse);

// POST /api/courses/:courseId/lessons - Add lesson to course
router.post('/:courseId/lessons', addLesson);

module.exports = router;