// Load environment variables - MUST BE FIRST
require('dotenv').config();

// Fallback in case dotenv doesn't load properly
if (!process.env.RESEND_API_KEY) {
  process.env.RESEND_API_KEY = 're_LRpFSWKg_H1vh67LwZJdY9DtjuihFXCyZ';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'my_super_secret_key_12345';
}
if (!process.env.PORT) {
  process.env.PORT = '5000';
}

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// ============================================
// ROOT ROUTE FOR RENDER
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    message: 'LearnHub API is running!',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Initialize Resend for emails
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'noreply@learnhub.com';

// Create certificates directory if it doesn't exist
const certsDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}
console.log(`📁 Certificates directory: ${certsDir}`);

// PostgreSQL connection pool using your Render database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ============================================
// EMAIL FUNCTIONS
// ============================================

async function sendWelcomeEmail(userName, userEmail) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: 'Welcome to LearnHub! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 12px;">
            <h1>Welcome to LearnHub, ${userName}! 🎓</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb; border-radius: 12px; margin-top: 20px;">
            <h2>Your learning journey starts here</h2>
            <p>We're excited to have you on board! LearnHub gives you access to:</p>
            <ul>
              <li>🎥 High-quality video lessons</li>
              <li>📊 Track your progress</li>
              <li>🎓 Earn certificates upon completion</li>
              <li>💬 Community support</li>
            </ul>
            <a href="https://learnhub.com/courses" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Start Learning Now →</a>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
            <p>© 2025 LearnHub. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log(`✅ Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
  }
}

async function sendEnrollmentEmail(userName, userEmail, courseTitle, coursePrice) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: `You're enrolled in ${courseTitle}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 12px;">
            <h1>Enrollment Confirmed! 🎉</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb; border-radius: 12px; margin-top: 20px;">
            <h2>Hello ${userName},</h2>
            <p>You have successfully enrolled in:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 10px 0;">📚 ${courseTitle}</h3>
              <p style="margin: 0; color: #6b7280;">${coursePrice === 0 ? 'Free Course' : `Price: ₦${(coursePrice * 1500).toLocaleString()}`}</p>
            </div>
            <a href="https://learnhub.com/courses" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Start Learning →</a>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
            <p>© 2025 LearnHub. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log(`✅ Enrollment email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Failed to send enrollment email:', error.message);
  }
}

// ============================================
// CERTIFICATE FUNCTIONS
// ============================================

// Generate a unique certificate number
function generateCertificateNumber(courseId, userId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CERT-${timestamp}-${randomPart}`;
}

// Generate PDF certificate
async function generateCertificate(userName, courseTitle, completionDate, certificateNumber) {
  return new Promise((resolve, reject) => {
    const fileName = `${certificateNumber}.pdf`;
    const filePath = path.join(certsDir, fileName);
    
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    
    // Add border
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .strokeColor('#2563eb')
      .lineWidth(3)
      .stroke();
    
    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
      .strokeColor('#4f46e5')
      .lineWidth(1)
      .stroke();
    
    // Add decorative top bar
    doc.rect(0, 0, doc.page.width, 15)
      .fillColor('#2563eb')
      .fill();
    
    // Logo / Title
    doc.fontSize(42)
      .fillColor('#1f2937')
      .text('🎓 LEARNHUB', { align: 'center', baseline: 'middle' })
      .moveDown(1);
    
    doc.fontSize(18)
      .fillColor('#6b7280')
      .text('Certificate of Completion', { align: 'center' })
      .moveDown(2);
    
    // Main text
    doc.fontSize(14)
      .fillColor('#374151')
      .text('This certificate is proudly presented to', { align: 'center' })
      .moveDown(1);
    
    doc.fontSize(32)
      .fillColor('#1f2937')
      .font('Helvetica-Bold')
      .text(userName.toUpperCase(), { align: 'center' })
      .moveDown(1);
    
    doc.fontSize(14)
      .fillColor('#374151')
      .font('Helvetica')
      .text('for successfully completing the course', { align: 'center' })
      .moveDown(1);
    
    doc.fontSize(24)
      .fillColor('#2563eb')
      .font('Helvetica-Bold')
      .text(courseTitle, { align: 'center' })
      .moveDown(2);
    
    // Date and Certificate ID
    const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    doc.fontSize(12)
      .fillColor('#6b7280')
      .font('Helvetica')
      .text(`Date: ${formattedDate}`, { align: 'center' })
      .moveDown(0.5);
    
    doc.text(`Certificate ID: ${certificateNumber}`, { align: 'center' })
      .moveDown(2);
    
    // Signature line
    doc.moveTo(200, doc.y)
      .lineTo(400, doc.y)
      .stroke();
    
    doc.fontSize(10)
      .text('Authorized Signature', 250, doc.y + 5, { align: 'center' })
      .moveDown(3);
    
    // Footer
    doc.fontSize(9)
      .fillColor('#9ca3af')
      .text('This certificate is proof of completion and does not confer academic credit.', 
        { align: 'center' });
    
    doc.end();
    
    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
  });
}

// Check if user has completed all lessons in a course
async function hasCompletedAllLessons(userId, courseId) {
  const result = await pool.query(`
    SELECT 
      COUNT(l.id) as total_lessons,
      COUNT(p.id) as completed_lessons
    FROM lessons l
    LEFT JOIN progress p ON p.lesson_id = l.id 
      AND p.user_id = $1 
      AND p.is_completed = 1
    WHERE l.course_id = $2
  `, [userId, courseId]);
  
  const total = parseInt(result.rows[0].total_lessons);
  const completed = parseInt(result.rows[0].completed_lessons);
  
  return total > 0 && completed === total;
}

// ============================================
// CREATE TABLES (runs automatically)
// ============================================
async function initDB() {
  try {
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        link TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Notifications table ready');

    // Certificates table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        certificate_number TEXT UNIQUE NOT NULL,
        issued_at TIMESTAMP DEFAULT NOW(),
        downloaded_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `);
    console.log('✅ Certificates table ready');

    console.log('\n🎉 All database tables created successfully!');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  }
}
initDB();

// ============================================
// HELPER: Create Notification
// ============================================
async function createNotification(userId, type, title, message, link = null) {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  await pool.query(
    'INSERT INTO notifications (id, user_id, type, title, message, link) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, userId, type, title, message, link]
  );
}

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    await sendWelcomeEmail(name, email);
    
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
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
    const courseResult = await pool.query('SELECT price, title FROM courses WHERE id = $1', [courseId]);
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
    
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [req.user.id]);
    await sendEnrollmentEmail(userResult.rows[0].name, userResult.rows[0].email, courseResult.rows[0].title, courseResult.rows[0].price);
    
    await createNotification(
      req.user.id,
      'enrollment',
      'Course Enrolled',
      `You have successfully enrolled in ${courseResult.rows[0].title}`,
      `/courses/${courseId}`
    );
    
    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// PROGRESS ROUTES (with auto-certificate generation)
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
    
    if (isCompleted) {
      await createNotification(
        userId,
        'achievement',
        'Lesson Completed',
        `You completed "${lesson.title}"! Keep going!`,
        `/courses/${lesson.course_id}`
      );
      
      // Check if all lessons are now complete
      const allCompleted = await hasCompletedAllLessons(userId, lesson.course_id);
      
      if (allCompleted) {
        // Auto-generate certificate
        const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [lesson.course_id]);
        const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
        const certificateNumber = generateCertificateNumber(lesson.course_id, userId);
        
        // Check if certificate already exists
        const existingCert = await pool.query('SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2', [userId, lesson.course_id]);
        
        if (existingCert.rows.length === 0) {
          await generateCertificate(userResult.rows[0].name, courseResult.rows[0].title, new Date(), certificateNumber);
          
          await pool.query(`
            INSERT INTO certificates (id, user_id, course_id, certificate_number, issued_at)
            VALUES ($1, $2, $3, $4, NOW())
          `, [`cert_${Date.now()}`, userId, lesson.course_id, certificateNumber]);
          
          await createNotification(
            userId,
            'achievement',
            '🏆 Course Completed!',
            `Congratulations! You've completed "${courseResult.rows[0].title}". Your certificate is ready!`,
            `/dashboard/student`
          );
        }
      }
    }
    
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

app.post('/api/courses/:courseId/reviews', protect, async (req, res) => {
  const { courseId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;
  const reviewId = `rev_${Date.now()}`;

  try {
    const enrollment = await pool.query('SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2', [userId, courseId]);
    if (enrollment.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'You must enroll to leave a review' });
    }

    const existingReview = await pool.query('SELECT * FROM reviews WHERE user_id = $1 AND course_id = $2', [userId, courseId]);
    if (existingReview.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this course' });
    }

    await pool.query(
      `INSERT INTO reviews (id, user_id, course_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [reviewId, userId, courseId, rating, comment]
    );

    const courseInfo = await pool.query('SELECT instructor_id, title FROM courses WHERE id = $1', [courseId]);
    const userInfo = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
    
    if (courseInfo.rows.length > 0 && courseInfo.rows[0].instructor_id !== userId) {
      await createNotification(
        courseInfo.rows[0].instructor_id,
        'review',
        'New Review Received',
        `${userInfo.rows[0].name} reviewed your course "${courseInfo.rows[0].title}" with ${rating} stars`,
        `/courses/${courseId}#reviews`
      );
    }

    const avgResult = await pool.query('SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE course_id = $1', [courseId]);
    const avgRating = avgResult.rows[0].avg_rating || 0;
    const totalReviews = avgResult.rows[0].total_reviews || 0;

    await pool.query('UPDATE courses SET average_rating = $1, total_reviews = $2 WHERE id = $3', [avgRating, totalReviews, courseId]);

    res.json({ success: true, message: 'Review added successfully', average_rating: avgRating, total_reviews: totalReviews });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// NOTIFICATIONS API ROUTES
// ============================================
app.get('/api/notifications', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30', [userId]);
    const unreadResult = await pool.query('SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE', [userId]);
    
    res.json({ success: true, notifications: result.rows, unread_count: parseInt(unreadResult.rows[0].count) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/notifications/:id/read', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [id, userId]);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/notifications/read-all', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [userId]);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// CERTIFICATE ROUTES
// ============================================

// Get all certificates for a user
app.get('/api/certificates/my-certificates', protect, async (req, res) => {
  const userId = req.user.id;
  
  try {
    const result = await pool.query(`
      SELECT c.*, cr.title as course_title
      FROM certificates c
      JOIN courses cr ON c.course_id = cr.id
      WHERE c.user_id = $1
      ORDER BY c.issued_at DESC
    `, [userId]);
    
    res.json({ success: true, certificates: result.rows });
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Download certificate
app.get('/api/certificates/download/:certificateNumber', protect, async (req, res) => {
  const { certificateNumber } = req.params;
  const userId = req.user.id;
  
  try {
    // Verify certificate belongs to user
    const certResult = await pool.query(
      'SELECT * FROM certificates WHERE certificate_number = $1 AND user_id = $2',
      [certificateNumber, userId]
    );
    
    if (certResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    
    // Update download timestamp
    await pool.query(
      'UPDATE certificates SET downloaded_at = NOW() WHERE certificate_number = $1',
      [certificateNumber]
    );
    
    const filePath = path.join(certsDir, `${certificateNumber}.pdf`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Certificate file not found' });
    }
    
    res.download(filePath, `Certificate-${certificateNumber}.pdf`);
    
  } catch (err) {
    console.error('Error downloading certificate:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// INSTRUCTOR ROUTES
// ============================================
app.get('/api/instructor/my-courses', protect, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const result = await pool.query(`
      SELECT 
        c.*,
        COUNT(DISTINCT e.user_id) as total_students,
        COALESCE(SUM(e.amount_paid), 0) as total_revenue
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.instructor_id = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [instructorId]);
    
    res.json({ success: true, courses: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/instructor/stats', protect, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT c.id) as total_courses,
        COUNT(DISTINCT e.user_id) as total_students,
        COALESCE(SUM(e.amount_paid), 0) as total_revenue
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.instructor_id = $1
    `, [instructorId]);
    
    const stats = result.rows[0];
    res.json({
      success: true,
      stats: {
        totalCourses: parseInt(stats.total_courses) || 0,
        totalStudents: parseInt(stats.total_students) || 0,
        totalRevenue: parseFloat(stats.total_revenue) || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/instructor/courses', protect, async (req, res) => {
  const { title, description, price, category, level, thumbnail } = req.body;
  const instructorId = req.user.id;
  const courseId = Date.now().toString();
  
  try {
    await pool.query(`
      INSERT INTO courses (id, title, description, price, category, level, thumbnail, instructor_id, is_published, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    `, [courseId, title, description, price, category, level, thumbnail, instructorId, 1]);
    
    res.status(201).json({ success: true, message: 'Course created successfully', courseId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/instructor/courses/:courseId', protect, async (req, res) => {
  const { courseId } = req.params;
  const { title, description, price, category, level, thumbnail, is_published } = req.body;
  const instructorId = req.user.id;
  
  try {
    const check = await pool.query('SELECT * FROM courses WHERE id = $1 AND instructor_id = $2', [courseId, instructorId]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await pool.query(`
      UPDATE courses SET title = $1, description = $2, price = $3, category = $4, level = $5, thumbnail = $6, is_published = $7
      WHERE id = $8
    `, [title, description, price, category, level, thumbnail, is_published, courseId]);
    
    res.json({ success: true, message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/instructor/courses/:courseId', protect, async (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user.id;
  
  try {
    const check = await pool.query('SELECT * FROM courses WHERE id = $1 AND instructor_id = $2', [courseId, instructorId]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await pool.query('DELETE FROM lessons WHERE course_id = $1', [courseId]);
    await pool.query('DELETE FROM enrollments WHERE course_id = $1', [courseId]);
    await pool.query('DELETE FROM progress WHERE course_id = $1', [courseId]);
    await pool.query('DELETE FROM courses WHERE id = $1', [courseId]);
    
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/instructor/courses/:courseId/lessons', protect, async (req, res) => {
  const { courseId } = req.params;
  const { title, description, video_url, duration, is_preview, order_num } = req.body;
  const instructorId = req.user.id;
  const lessonId = `l${Date.now()}`;
  
  try {
    const check = await pool.query('SELECT * FROM courses WHERE id = $1 AND instructor_id = $2', [courseId, instructorId]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await pool.query(`
      INSERT INTO lessons (id, course_id, title, description, video_url, duration, order_num, is_preview)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [lessonId, courseId, title, description, video_url, duration, order_num, is_preview ? 1 : 0]);
    
    await pool.query(`
      UPDATE courses 
      SET total_duration = (SELECT COALESCE(SUM(duration), 0) / 3600 FROM lessons WHERE course_id = $1)
      WHERE id = $1
    `, [courseId]);
    
    res.status(201).json({ success: true, message: 'Lesson added successfully', lessonId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// 404 HANDLER - Must be after all routes
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found`
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 PostgreSQL server running on port ${PORT}`);
  console.log(`✅ Database: PostgreSQL (Render Cloud)`);
  console.log(`📧 Email notifications enabled`);
  console.log(`📜 Certificate generation enabled`);
  console.log(`\n📋 Available Routes:`);
  console.log(`   GET  /                    - API Status`);
  console.log(`   GET  /api/courses         - All courses`);
  console.log(`   POST /api/auth/login      - Login`);
  console.log(`   POST /api/auth/register   - Register`);
  console.log(`   GET  /api/certificates/my-certificates - User certificates`);
});