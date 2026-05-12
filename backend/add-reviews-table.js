const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./learning-platform.db');

// Create reviews table
db.run(`
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id)
  )
`, (err) => {
  if (err) {
    console.log('❌ Error creating table:', err.message);
  } else {
    console.log('✅ Reviews table created successfully');
  }
  
  // Add average_rating column to courses table (for quick display)
  db.run(`ALTER TABLE courses ADD COLUMN average_rating REAL DEFAULT 0`, (err) => {
    if (err && err.message.includes('duplicate')) {
      console.log('✅ average_rating column already exists');
    } else if (err) {
      console.log('Note:', err.message);
    } else {
      console.log('✅ Added average_rating column');
    }
    
    db.run(`ALTER TABLE courses ADD COLUMN total_reviews INTEGER DEFAULT 0`, (err) => {
      if (err && err.message.includes('duplicate')) {
        console.log('✅ total_reviews column already exists');
      } else if (err) {
        console.log('Note:', err.message);
      } else {
        console.log('✅ Added total_reviews column');
      }
      
      db.close(() => console.log('\n✅ Database ready! Restart your backend.'));
    });
  });
});