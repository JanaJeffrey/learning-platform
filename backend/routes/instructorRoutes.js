const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getInstructorCourses,
  getInstructorStats,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/instructorController');

const router = express.Router();

// All instructor routes require authentication
router.use(protect);

// Dashboard routes
router.get('/my-courses', getInstructorCourses);
router.get('/stats', getInstructorStats);

// Course management
router.post('/courses', createCourse);
router.put('/courses/:courseId', updateCourse);
router.delete('/courses/:courseId', deleteCourse);

// Lesson management
router.post('/courses/:courseId/lessons', addLesson);
router.put('/lessons/:lessonId', updateLesson);
router.delete('/lessons/:lessonId', deleteLesson);

module.exports = router;