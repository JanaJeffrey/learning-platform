const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// Open database
const db = new sqlite3.Database('./learning-platform.db');

// ============================================
// MIDDLEWARE: Protect routes (require login)
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
    const decoded = jwt.verify(token, 'secret_key');
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// ============================================
// COURSE ROUTES
// ============================================

// Get all courses
app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM courses WHERE is_published = 1', [], (err, courses) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json({ success: true, count: courses.length, courses });
    }
  });
});

// Get single course with lessons
app.get('/api/courses/:id', (req, res) => {
  db.get('SELECT *, average_rating, total_reviews FROM courses WHERE id = ?', [req.params.id], (err, course) => {
    if (err || !course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    db.all('SELECT * FROM lessons WHERE course_id = ? ORDER BY order_num', [course.id], (err, lessons) => {
      const isFreeCourse = course.price === 0;
      let isEnrolled = false;

      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, 'secret_key');
          db.get('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
            [decoded.id, course.id], (err, enrollment) => {
              isEnrolled = !!enrollment;
              sendResponse(isEnrolled);
            });
        } catch (e) {
          sendResponse(false);
        }
      } else {
        sendResponse(false);
      }

      function sendResponse(isEnrolled) {
        const lessonsWithAccess = lessons.map(lesson => ({
          ...lesson,
          canWatch: isFreeCourse || isEnrolled || lesson.is_preview === 1
        }));

        res.json({
          success: true,
          course: {
            ...course,
            lessons: lessonsWithAccess,
            isEnrolled,
            isFree: isFreeCourse
          }
        });
      }
    });
  });
});

// ============================================
// LESSON ROUTES
// ============================================
app.get('/api/lessons/:lessonId', protect, (req, res) => {
  const { lessonId } = req.params;

  db.get(`
    SELECT l.*, c.title as course_title, c.price 
    FROM lessons l 
    JOIN courses c ON l.course_id = c.id 
    WHERE l.id = ?
  `, [lessonId], (err, lesson) => {
    if (err || !lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const isFreeCourse = lesson.price === 0;

    if (isFreeCourse || lesson.is_preview === 1) {
      return res.json({ success: true, lesson });
    }

    db.get('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [req.user.id, lesson.course_id], (err, enrollment) => {
        if (enrollment) {
          res.json({ success: true, lesson });
        } else {
          res.status(403).json({ success: false, message: 'You must enroll to watch this lesson' });
        }
      });
  });
});

// ============================================
// PROGRESS ROUTES
// ============================================
app.post('/api/progress', protect, (req, res) => {
  const { lessonId, watchedDuration } = req.body;
  const userId = req.user.id;

  db.get('SELECT * FROM lessons WHERE id = ?', [lessonId], (err, lesson) => {
    if (err || !lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const isCompleted = watchedDuration >= lesson.duration * 0.9;
    const progressId = `progress_${userId}_${lessonId}`;
    const now = new Date().toISOString();

    db.run(`INSERT OR REPLACE INTO progress (id, user_id, lesson_id, course_id, is_completed, watched_duration, last_watched_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [progressId, userId, lessonId, lesson.course_id, isCompleted ? 1 : 0, watchedDuration, now],
      (err) => {
        if (err) {
          res.status(500).json({ success: false, message: err.message });
        } else {
          res.json({ success: true, isCompleted, watchedDuration });
        }
      });
  });
});

app.get('/api/progress/course/:courseId', protect, (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  db.all('SELECT * FROM progress WHERE user_id = ? AND course_id = ?',
    [userId, courseId], (err, progress) => {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
      } else {
        res.json({ success: true, progress });
      }
    });
});

// ============================================
// REVIEWS API
// ============================================
app.get('/api/courses/:courseId/reviews', (req, res) => {
  const { courseId } = req.params;
  
  db.all(`
    SELECT r.*, u.name as user_name 
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.course_id = ?
    ORDER BY r.created_at DESC
  `, [courseId], (err, reviews) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json({ success: true, reviews });
    }
  });
});

app.post('/api/courses/:courseId/reviews', protect, (req, res) => {
  const { courseId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;
  const reviewId = `rev_${Date.now()}`;
  
  db.get('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?', 
    [userId, courseId], (err, enrollment) => {
      if (!enrollment) {
        return res.status(403).json({ 
          success: false, 
          message: 'You must enroll in this course to leave a review' 
        });
      }
      
      db.get('SELECT * FROM reviews WHERE user_id = ? AND course_id = ?', 
        [userId, courseId], (err, existing) => {
          if (existing) {
            return res.status(400).json({ 
              success: false, 
              message: 'You have already reviewed this course' 
            });
          }
          
          db.run(`
            INSERT INTO reviews (id, user_id, course_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [reviewId, userId, courseId, rating, comment, new Date().toISOString()], (err) => {
            if (err) {
              res.status(500).json({ success: false, message: err.message });
            } else {
              db.get(`
                SELECT AVG(rating) as avg_rating, COUNT(*) as total 
                FROM reviews 
                WHERE course_id = ?
              `, [courseId], (err, stats) => {
                db.run(`
                  UPDATE courses 
                  SET average_rating = ?, total_reviews = ?
                  WHERE id = ?
                `, [stats.avg_rating || 0, stats.total || 0, courseId], (err) => {
                  res.json({ 
                    success: true, 
                    message: 'Review added successfully',
                    average_rating: stats.avg_rating,
                    total_reviews: stats.total
                  });
                });
              });
            }
          });
        });
    });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existing) => {
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Date.now().toString();

    db.run('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, role || 'student', new Date().toISOString()],
      (err) => {
        if (err) {
          res.status(500).json({ success: false, message: err.message });
        } else {
          const token = jwt.sign({ id }, 'secret_key', { expiresIn: '30d' });
          res.json({ success: true, token, user: { _id: id, name, email, role: role || 'student' } });
        }
      });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '30d' });
    res.json({ success: true, token, user: { _id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

// ============================================
// PROFILE API
// ============================================
app.get('/api/auth/me', protect, (req, res) => {
  const userId = req.user.id;
  
  db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  });
});

app.put('/api/auth/update-profile', protect, (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  
  db.run('UPDATE users SET name = ? WHERE id = ?', [name, userId], (err) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json({ success: true, message: 'Profile updated successfully' });
    }
  });
});

app.post('/api/auth/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;
  
  db.get('SELECT * FROM users WHERE id = ?', [userId], async (err, user) => {
    if (err || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err) => {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
      } else {
        res.json({ success: true, message: 'Password changed successfully' });
      }
    });
  });
});

// ============================================
// ENROLLMENT ROUTES
// ============================================
app.post('/api/enroll', protect, (req, res) => {
  const { courseId } = req.body;
  const enrollmentId = Date.now().toString();

  db.get('SELECT price FROM courses WHERE id = ?', [courseId], (err, course) => {
    if (err || !course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    db.get('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [req.user.id, courseId], (err, existing) => {
        if (existing) {
          return res.status(400).json({ success: false, message: 'Already enrolled' });
        }

        db.run('INSERT INTO enrollments (id, user_id, course_id, enrolled_at, amount_paid) VALUES (?, ?, ?, ?, ?)',
          [enrollmentId, req.user.id, courseId, new Date().toISOString(), course.price],
          (err) => {
            if (err) {
              res.status(500).json({ success: false, message: err.message });
            } else {
              db.run('UPDATE courses SET enrolledStudents = enrolledStudents + 1 WHERE id = ?', [courseId]);
              res.json({ success: true, message: 'Enrolled successfully' });
            }
          });
      });
  });
});

// ============================================
// STUDENT DASHBOARD API
// ============================================
app.get('/api/dashboard/my-courses', protect, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      c.*,
      COUNT(DISTINCT l.id) as total_lessons,
      COUNT(DISTINCT CASE WHEN p.is_completed = 1 THEN p.lesson_id END) as completed_lessons,
      CASE 
        WHEN COUNT(DISTINCT l.id) > 0 
        THEN ROUND(100.0 * COUNT(DISTINCT CASE WHEN p.is_completed = 1 THEN p.lesson_id END) / COUNT(DISTINCT l.id))
        ELSE 0 
      END as progress_percentage
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    LEFT JOIN lessons l ON l.course_id = c.id
    LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
    WHERE e.user_id = ?
    GROUP BY c.id
    ORDER BY e.enrolled_at DESC
  `;

  db.all(sql, [userId], (err, courses) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json({ success: true, courses });
    }
  });
});

app.get('/api/dashboard/stats', protect, (req, res) => {
  const userId = req.user.id;

  db.get(`
    SELECT 
      COUNT(DISTINCT e.course_id) as total_courses,
      COUNT(DISTINCT CASE WHEN p.is_completed = 1 THEN p.lesson_id END) as completed_lessons,
      COUNT(DISTINCT l.id) as total_lessons
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    LEFT JOIN lessons l ON l.course_id = c.id
    LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
    WHERE e.user_id = ?
  `, [userId], (err, stats) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      const avgProgress = stats.total_lessons > 0
        ? Math.round((stats.completed_lessons / stats.total_lessons) * 100)
        : 0;

      res.json({
        success: true,
        stats: {
          totalCourses: stats.total_courses || 0,
          completedLessons: stats.completed_lessons || 0,
          totalLessons: stats.total_lessons || 0,
          averageProgress: avgProgress
        }
      });
    }
  });
});

app.get('/api/dashboard/recent-activity', protect, (req, res) => {
  const userId = req.user.id;

  db.all(`
    SELECT 
      p.completed_at as completed_at,
      l.title as lesson_title,
      c.title as course_title,
      l.id as lesson_id,
      c.id as course_id
    FROM progress p
    JOIN lessons l ON p.lesson_id = l.id
    JOIN courses c ON l.course_id = c.id
    WHERE p.user_id = ? AND p.is_completed = 1
    ORDER BY p.completed_at DESC
    LIMIT 5
  `, [userId], (err, activities) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json({ success: true, activities });
    }
  });
});

// ============================================
// INSTRUCTOR DASHBOARD API
// ============================================
app.get('/api/instructor/my-courses', protect, async (req, res) => {
  try {
    const instructorId = req.user.id;

    db.all(`
      SELECT 
        c.*,
        COUNT(DISTINCT e.user_id) as total_students,
        SUM(CASE WHEN c.price > 0 THEN COALESCE(e.amount_paid, 0) ELSE 0 END) as total_revenue
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.instructor_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [instructorId], (err, courses) => {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
      } else {
        res.json({ success: true, courses });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/instructor/stats', protect, (req, res) => {
  const instructorId = req.user.id;

  db.get(`
    SELECT 
      COUNT(DISTINCT c.id) as total_courses,
      COUNT(DISTINCT e.user_id) as total_students,
      SUM(CASE WHEN c.price > 0 THEN COALESCE(e.amount_paid, 0) ELSE 0 END) as total_revenue
    FROM courses c
    LEFT JOIN enrollments e ON c.id = e.course_id
    WHERE c.instructor_id = ?
  `, [instructorId], (err, stats) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json({
        success: true,
        stats: {
          totalCourses: stats.total_courses || 0,
          totalStudents: stats.total_students || 0,
          totalRevenue: stats.total_revenue || 0
        }
      });
    }
  });
});

app.post('/api/instructor/courses', protect, (req, res) => {
  const { title, description, price, category, level, thumbnail } = req.body;
  const instructorId = req.user.id;
  const courseId = Date.now().toString();

  db.run(`
    INSERT INTO courses (id, title, description, price, category, level, thumbnail, instructor_id, is_published, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [courseId, title, description, price, category, level, thumbnail, instructorId, 0, new Date().toISOString()], (err) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.status(201).json({ success: true, message: 'Course created successfully', courseId });
    }
  });
});

app.put('/api/instructor/courses/:courseId', protect, (req, res) => {
  const { courseId } = req.params;
  const { title, description, price, category, level, thumbnail, is_published } = req.body;
  const instructorId = req.user.id;

  db.get('SELECT * FROM courses WHERE id = ? AND instructor_id = ?', [courseId, instructorId], (err, course) => {
    if (!course) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this course' });
    }

    db.run(`
      UPDATE courses 
      SET title = ?, description = ?, price = ?, category = ?, level = ?, thumbnail = ?, is_published = ?
      WHERE id = ?
    `, [title, description, price, category, level, thumbnail, is_published, courseId], (err) => {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
      } else {
        res.json({ success: true, message: 'Course updated successfully' });
      }
    });
  });
});

app.delete('/api/instructor/courses/:courseId', protect, (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user.id;

  db.get('SELECT * FROM courses WHERE id = ? AND instructor_id = ?', [courseId, instructorId], (err, course) => {
    if (!course) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    db.run('DELETE FROM lessons WHERE course_id = ?', [courseId], (err) => {
      db.run('DELETE FROM enrollments WHERE course_id = ?', [courseId], (err) => {
        db.run('DELETE FROM courses WHERE id = ?', [courseId], (err) => {
          res.json({ success: true, message: 'Course deleted successfully' });
        });
      });
    });
  });
});

app.post('/api/instructor/courses/:courseId/lessons', protect, (req, res) => {
  const { courseId } = req.params;
  const { title, description, video_url, duration, is_preview, order_num } = req.body;
  const instructorId = req.user.id;
  const lessonId = `l${Date.now()}`;

  db.get('SELECT * FROM courses WHERE id = ? AND instructor_id = ?', [courseId, instructorId], (err, course) => {
    if (!course) {
      return res.status(403).json({ success: false, message: 'Not authorized to add lessons to this course' });
    }

    db.run(`
      INSERT INTO lessons (id, course_id, title, description, video_url, duration, order_num, is_preview)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [lessonId, courseId, title, description, video_url, duration, order_num, is_preview ? 1 : 0], (err) => {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
      } else {
        res.status(201).json({ success: true, message: 'Lesson added successfully', lessonId });
      }
    });
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Courses API: http://localhost:${PORT}/api/courses`);
  console.log(`✅ Instructor API: http://localhost:${PORT}/api/instructor`);
  console.log(`✅ Reviews API: http://localhost:${PORT}/api/courses/:courseId/reviews`);
  console.log(`✅ Profile API: http://localhost:${PORT}/api/auth/me`);
  console.log(`📚 SQLite database is working!`);
  console.log(`🎥 Lesson API: http://localhost:${PORT}/api/lessons/:lessonId`);
  console.log(`📊 Progress API: http://localhost:${PORT}/api/progress`);
});