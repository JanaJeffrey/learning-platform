const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructorId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'name email')
      .populate('lessons');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // User must be logged in to access any course
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access course content'
      });
    }

    const isFreeCourse = course.price === 0;
    
    // Check if user is enrolled
    let isEnrolled = false;
    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId: course._id
    });
    isEnrolled = !!enrollment;

    // FREE COURSE + LOGGED IN = Full access
    if (isFreeCourse) {
      return res.status(200).json({
        success: true,
        course: {
          ...course.toObject(),
          lessons: course.lessons,
          isEnrolled: true,
          isFree: true
        }
      });
    }

    // PAID COURSE - Check enrollment
    let lessonsToReturn = course.lessons;
    if (!isEnrolled && req.user?.role !== 'instructor') {
      lessonsToReturn = course.lessons.filter(lesson => lesson.isPreview === true);
    }

    res.status(200).json({
      success: true,
      course: {
        ...course.toObject(),
        lessons: lessonsToReturn,
        isEnrolled,
        isFree: false
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.createCourse = async (req, res) => {
  try {
    req.body.instructorId = req.user.id;
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await Lesson.deleteMany({ courseId: course._id });
    await Enrollment.deleteMany({ courseId: course._id });
    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user.id })
      .populate('lessons')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }

    req.body.courseId = req.params.courseId;
    const lesson = await Lesson.create(req.body);
    
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({
      success: true,
      lesson
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};