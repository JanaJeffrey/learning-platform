// ============================================
// ENROLLMENT ROUTES
// ============================================
// These URLs handle course registration

const express = require('express');
const {
  enrollInCourse,
  checkEnrollment,
  getMyEnrolledCourses
} = require('../controllers/enrollmentController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// All enrollment routes require login (can't enroll if not logged in)
router.use(protect);

// POST /api/enroll - Enroll in a course
router.post('/', enrollInCourse);

// GET /api/enroll/check/:courseId - Check if enrolled
router.get('/check/:courseId', checkEnrollment);

// GET /api/enroll/my-courses - Get all enrolled courses
router.get('/my-courses', getMyEnrolledCourses);

module.exports = router;