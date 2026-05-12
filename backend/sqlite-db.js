const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file (this is your entire database - no MongoDB needed!)
const db = new sqlite3.Database('./learning-platform.db');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    created_at TEXT
  )`);

  // Courses table
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    price REAL,
    category TEXT,
    level TEXT,
    thumbnail TEXT,
    is_published INTEGER
  )`);

  // Enrollments table
  db.run(`CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    course_id TEXT,
    enrolled_at TEXT
  )`);

  console.log('✅ SQLite database created');
  
  // Insert sample courses
  const courses = [
    ['1', 'Complete Web Development', 'Learn HTML, CSS, JavaScript, React', 0, 'Web Development', 'beginner', '💻', 1],
    ['2', 'Machine Learning A-Z', 'Learn ML algorithms, TensorFlow', 0, 'Data Science', 'advanced', '🤖', 1],
    ['3', 'Advanced Python', 'Master Python programming', 49.99, 'Programming', 'intermediate', '🐍', 1],
    ['4', 'UI/UX Design', 'Learn Figma and design', 39.99, 'Design', 'beginner', '🎨', 1],
    ['5', 'React & Next.js', 'Modern web development', 59.99, 'Web Development', 'intermediate', '⚛️', 1]
  ];

  const insertCourse = db.prepare(`INSERT OR REPLACE INTO courses VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  for (let course of courses) {
    insertCourse.run(course);
  }
  console.log(`✅ Added ${courses.length} courses`);
});

db.close();
console.log('\n📚 Database ready at: backend/learning-platform.db');