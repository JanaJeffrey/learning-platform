// ============================================
// ENROLLMENT CONTROLLER
// ============================================
// This handles students signing up for courses
// Think of it as a school registration office

const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

// ============================================
// @desc    Enroll user in a course
// @route   POST /api/enroll
// @access  Private (must be logged in)
// ============================================
// When a student clicks "Enroll Now" on a course page
exports.enrollInCourse = async (req, res) => {
  try {
    // Get the course ID from the request body
    // Frontend sends: { courseId: "abc123" }
    const { courseId } = req.body;
    
    // Get the user ID from the JWT token (added by auth middleware)
    // When user logs in, we save their info in req.user
    const userId = req.user.id;

    // ============================================
    // STEP 1: Check if course exists
    // ============================================
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // ============================================
    // STEP 2: Check if already enrolled
    // ============================================
    // Prevent duplicate enrollments (can't enroll twice)
    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // ============================================
    // STEP 3: Create the enrollment record
    // ============================================
    // This is like signing a student's name on a class list
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      paymentStatus: 'completed', // In real app, this would be after payment
      amountPaid: course.price
    });

    // ============================================
    // STEP 4: Increase enrolled student count
    // ============================================
    // So the course shows "1,234 students enrolled"
    course.enrolledStudents += 1;
    await course.save();

    // ============================================
    // STEP 5: Create progress tracking for each lesson
    // ============================================
    // When student enrolls, we create empty progress records
    // for every lesson. As they watch, we update these.
    const lessons = course.lessons;
    for (const lessonId of lessons) {
      await Progress.create({
        userId,
        lessonId,
        courseId,
        isWatched: false,
        watchedDuration: 0
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// @desc    Check if user is enrolled in a course
// @route   GET /api/enroll/check/:courseId
// @access  Private
// ============================================
// Used on the course detail page to show:
// - "Enroll Now" button if NOT enrolled
// - "Continue Learning" button if enrolled
exports.checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      userId,
      courseId
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment  // true if enrolled, false if not
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// @desc    Get all enrolled courses for a student
// @route   GET /api/enroll/my-courses
// @access  Private
// ============================================
// Used on the Student Dashboard to show:
// "Your Enrolled Courses" section with progress
exports.getMyEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all enrollments for this user
    const enrollments = await Enrollment.find({ userId })
      .populate('courseId')  // Get the full course details
      .sort({ enrolledAt: -1 }); // Newest first

    // For each course, calculate progress percentage
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = enrollment.courseId;
        
        // Count total lessons in this course
        const totalLessons = course.lessons.length;
        
        // Count how many lessons the student has completed
        const completedLessons = await Progress.countDocuments({
          userId,
          courseId: course._id,
          isWatched: true
        });
        
        // Calculate percentage
        const progress = totalLessons > 0 
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;
        
        return {
          ...course.toObject(),
          enrollmentId: enrollment._id,
          enrolledAt: enrollment.enrolledAt,
          progress,
          completedLessons,
          totalLessons
        };
      })
    );

    res.status(200).json({
      success: true,
      count: coursesWithProgress.length,
      courses: coursesWithProgress
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};