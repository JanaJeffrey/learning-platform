const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./learning-platform.db');

// Add lessons to each course
const lessons = [
  // Web Development Course (id: 1) - 5 lessons
  { id: 'l1', course_id: '1', title: 'Introduction to Web Development', description: 'What is web development?', duration: 600, order_num: 1, is_preview: 1 },
  { id: 'l2', course_id: '1', title: 'HTML Fundamentals', description: 'Learn HTML tags and structure', duration: 900, order_num: 2, is_preview: 1 },
  { id: 'l3', course_id: '1', title: 'CSS Styling', description: 'Make websites beautiful', duration: 1200, order_num: 3, is_preview: 0 },
  { id: 'l4', course_id: '1', title: 'JavaScript Basics', description: 'Add interactivity', duration: 1500, order_num: 4, is_preview: 0 },
  { id: 'l5', course_id: '1', title: 'React Introduction', description: 'Build modern apps', duration: 1800, order_num: 5, is_preview: 0 },
  
  // Machine Learning Course (id: 2) - 4 lessons
  { id: 'l6', course_id: '2', title: 'What is Machine Learning?', description: 'Introduction to ML', duration: 600, order_num: 1, is_preview: 1 },
  { id: 'l7', course_id: '2', title: 'Python for ML', description: 'Python basics for ML', duration: 900, order_num: 2, is_preview: 0 },
  { id: 'l8', course_id: '2', title: 'Linear Regression', description: 'First ML algorithm', duration: 1200, order_num: 3, is_preview: 0 },
  { id: 'l9', course_id: '2', title: 'Neural Networks', description: 'Deep learning basics', duration: 1500, order_num: 4, is_preview: 0 },
  
  // Python Course (id: 3) - 3 lessons
  { id: 'l10', course_id: '3', title: 'Python Setup', description: 'Install Python and IDE', duration: 300, order_num: 1, is_preview: 1 },
  { id: 'l11', course_id: '3', title: 'Variables and Data Types', description: 'Python basics', duration: 600, order_num: 2, is_preview: 0 },
  { id: 'l12', course_id: '3', title: 'Functions and OOP', description: 'Advanced Python', duration: 900, order_num: 3, is_preview: 0 },
  
  // UI/UX Course (id: 4) - 3 lessons
  { id: 'l13', course_id: '4', title: 'Design Fundamentals', description: 'Basic design principles', duration: 600, order_num: 1, is_preview: 1 },
  { id: 'l14', course_id: '4', title: 'Figma Basics', description: 'Learn Figma tools', duration: 900, order_num: 2, is_preview: 0 },
  { id: 'l15', course_id: '4', title: 'Prototyping', description: 'Create interactive prototypes', duration: 600, order_num: 3, is_preview: 0 },
  
  // React Course (id: 5) - 4 lessons
  { id: 'l16', course_id: '5', title: 'React Setup', description: 'Create React App', duration: 300, order_num: 1, is_preview: 1 },
  { id: 'l17', course_id: '5', title: 'Components and Props', description: 'React basics', duration: 900, order_num: 2, is_preview: 0 },
  { id: 'l18', course_id: '5', title: 'State and Hooks', description: 'useState, useEffect', duration: 1200, order_num: 3, is_preview: 0 },
  { id: 'l19', course_id: '5', title: 'Next.js Basics', description: 'Server-side rendering', duration: 900, order_num: 4, is_preview: 0 }
];

db.serialize(() => {
  // Create lessons table
  db.run(`CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT,
    title TEXT,
    description TEXT,
    duration INTEGER,
    order_num INTEGER,
    is_preview INTEGER,
    video_url TEXT
  )`);

  // Create progress table
  db.run(`CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    lesson_id TEXT,
    course_id TEXT,
    is_completed INTEGER DEFAULT 0,
    watched_duration INTEGER DEFAULT 0,
    last_watched_at TEXT,
    UNIQUE(user_id, lesson_id)
  )`);

  console.log('✅ Tables created: lessons, progress');

  // Insert lessons
  const insertLesson = db.prepare(`INSERT OR REPLACE INTO lessons VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  for (let lesson of lessons) {
    insertLesson.run([lesson.id, lesson.course_id, lesson.title, lesson.description, lesson.duration, lesson.order_num, lesson.is_preview, null]);
  }
  console.log(`✅ Added ${lessons.length} lessons`);

  // Verify
  db.all('SELECT course_id, COUNT(*) as count FROM lessons GROUP BY course_id', [], (err, rows) => {
    console.log('\n📚 Lessons per course:');
    rows.forEach(row => {
      console.log(`   Course ${row.course_id}: ${row.count} lessons`);
    });
  });
});

db.close();
console.log('\n✅ Database updated! Run: node server-sqlite.js to start');