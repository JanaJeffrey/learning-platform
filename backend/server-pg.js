const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection pool using your Render database
const pool = new Pool({
  connectionString: 'postgresql://learnhub_user:Jk6a6VA8u13XaI0gAs4JDkUUhC6JvkTD@dpg-d828b83rjlhs738h3lo0-a/learnhub_2hkr',
  ssl: { rejectUnauthorized: false }
});

// ============================================
// CREATE TABLES (runs automatically)
// ============================================
async function initDB() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Users table ready');

    // Courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        price REAL DEFAULT 0,
        category TEXT,
        level TEXT,
        thumbnail TEXT,
        instructor_id TEXT,
        is_published INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        enrolled_students INTEGER DEFAULT 0,
        total_duration INTEGER DEFAULT 30,
        average_rating REAL DEFAULT 0,
        total_reviews INTEGER DEFAULT 0
      )
    `);
    console.log('✅ Courses table ready');

    // Lessons table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        course_id TEXT,
        title TEXT,
        description TEXT,
        video_url TEXT,
        duration INTEGER,
        order_num INTEGER,
        is_preview INTEGER DEFAULT 0
      )
    `);
    console.log('✅ Lessons table ready');

    // Enrollments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        course_id TEXT,
        enrolled_at TIMESTAMP DEFAULT NOW(),
        amount_paid REAL DEFAULT 0
      )
    `);
    console.log('✅ Enrollments table ready');

    // Progress table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        lesson_id TEXT,
        course_id TEXT,
        is_completed INTEGER DEFAULT 0,
        watched_duration INTEGER DEFAULT 0,
        last_watched_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Progress table ready');

    // Reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        course_id TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Reviews table ready');

    console.log('\n🎉 All database tables created successfully!');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  }
}
initDB();

// ============================================
// MIDDLEWARE
// ============================================
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// ============================================
// AUTH ROUTES
// ============================================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    
    await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      [id, name, email, hashedPassword, role || 'student']
    );
    
    const token = jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '30d' });
    res.json({ success: true, token, user: { _id: id, name, email, role: role || 'student' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '30d' });
    res.json({ success: true, token, user: { _id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// COURSE ROUTES
// ============================================
app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE is_published = 1 ORDER BY created_at DESC');
    res.json({ success: true, count: result.rows.length, courses: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const course = courseResult.rows[0];
    const lessonsResult = await pool.query('SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_num', [course.id]);
    
    res.json({
      success: true,
      course: {
        ...course,
        lessons: lessonsResult.rows,
        isEnrolled: false,
        isFree: course.price === 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// LESSON ROUTES
// ============================================
app.get('/api/lessons/:lessonId', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, c.title as course_title, c.price 
      FROM lessons l 
      JOIN courses c ON l.course_id = c.id 
      WHERE l.id = $1
    `, [req.params.lessonId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    
    res.json({ success: true, lesson: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// ENROLLMENT ROUTES
// ============================================
app.post('/api/enroll', protect, async (req, res) => {
  const { courseId } = req.body;
  const enrollmentId = Date.now().toString();
  
  try {
    const courseResult = await pool.query('SELECT price FROM courses WHERE id = $1', [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const existing = await pool.query('SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2', [req.user.id, courseId]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }
    
    await pool.query(
      'INSERT INTO enrollments (id, user_id, course_id, amount_paid) VALUES ($1, $2, $3, $4)',
      [enrollmentId, req.user.id, courseId, courseResult.rows[0].price]
    );
    
    await pool.query('UPDATE courses SET enrolled_students = enrolled_students + 1 WHERE id = $1', [courseId]);
    
    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// PROGRESS ROUTES
// ============================================
app.post('/api/progress', protect, async (req, res) => {
  const { lessonId, watchedDuration } = req.body;
  const userId = req.user.id;
  const progressId = `progress_${userId}_${lessonId}`;
  
  try {
    const lessonResult = await pool.query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    
    const lesson = lessonResult.rows[0];
    const isCompleted = watchedDuration >= lesson.duration * 0.9;
    
    await pool.query(`
      INSERT INTO progress (id, user_id, lesson_id, course_id, is_completed, watched_duration)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET 
        is_completed = EXCLUDED.is_completed,
        watched_duration = EXCLUDED.watched_duration,
        last_watched_at = NOW()
    `, [progressId, userId, lessonId, lesson.course_id, isCompleted ? 1 : 0, watchedDuration]);
    
    res.json({ success: true, isCompleted, watchedDuration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// DASHBOARD ROUTES
// ============================================
app.get('/api/dashboard/my-courses', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, 
        COUNT(DISTINCT l.id) as total_lessons,
        COUNT(DISTINCT CASE WHEN p.is_completed = 1 THEN p.lesson_id END) as completed_lessons
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN lessons l ON l.course_id = c.id
      LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
      WHERE e.user_id = $1
      GROUP BY c.id
    `, [req.user.id]);
    
    const coursesWithProgress = result.rows.map(course => ({
      ...course,
      progress_percentage: course.total_lessons > 0 ? Math.round((course.completed_lessons / course.total_lessons) * 100) : 0
    }));
    
    res.json({ success: true, courses: coursesWithProgress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/dashboard/stats', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT e.course_id) as total_courses,
        COUNT(DISTINCT CASE WHEN p.is_completed = 1 THEN p.lesson_id END) as completed_lessons,
        COUNT(DISTINCT l.id) as total_lessons
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN lessons l ON l.course_id = c.id
      LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
      WHERE e.user_id = $1
    `, [req.user.id]);
    
    const stats = result.rows[0];
    const avgProgress = stats.total_lessons > 0 ? Math.round((stats.completed_lessons / stats.total_lessons) * 100) : 0;
    
    res.json({
      success: true,
      stats: {
        totalCourses: parseInt(stats.total_courses) || 0,
        completedLessons: parseInt(stats.completed_lessons) || 0,
        totalLessons: parseInt(stats.total_lessons) || 0,
        averageProgress: avgProgress
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// REVIEWS API ROUTES
// ============================================

// Get all reviews for a course (public)
app.get('/api/courses/:courseId/reviews', async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = $1
      ORDER BY r.created_at DESC
    `, [courseId]);
    
    res.json({ success: true, reviews: result.rows });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a review (requires authentication and enrollment)
app.post('/api/courses/:courseId/reviews', protect, async (req, res) => {
  const { courseId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;
  const reviewId = `rev_${Date.now()}`;

  try {
    // Check if user is enrolled in the course
    const enrollment = await pool.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    
    if (enrollment.rows.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: 'You must enroll in this course to leave a review' 
      });
    }

    // Check if user has already reviewed this course
    const existingReview = await pool.query(
      'SELECT * FROM reviews WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    
    if (existingReview.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this course' 
      });
    }

    // Insert the review
    await pool.query(
      `INSERT INTO reviews (id, user_id, course_id, rating, comment, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [reviewId, userId, courseId, rating, comment]
    );

    // Update course average rating and review count
    const avgResult = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE course_id = $1',
      [courseId]
    );
    
    const avgRating = avgResult.rows[0].avg_rating || 0;
    const totalReviews = avgResult.rows[0].total_reviews || 0;

    await pool.query(
      'UPDATE courses SET average_rating = $1, total_reviews = $2 WHERE id = $3',
      [avgRating, totalReviews, courseId]
    );

    res.json({ 
      success: true, 
      message: 'Review added successfully',
      average_rating: avgRating,
      total_reviews: totalReviews
    });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 PostgreSQL server running on http://localhost:${PORT}`);
  console.log(`✅ Database: PostgreSQL (Render Cloud)`);
});