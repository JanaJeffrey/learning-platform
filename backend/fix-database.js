const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./learning-platform.db');

// Add instructor_id column to courses table
db.run('ALTER TABLE courses ADD COLUMN instructor_id TEXT', (err) => {
  if (err && err.message.includes('duplicate column name')) {
    console.log('✅ instructor_id column already exists');
  } else if (err) {
    console.log('Error adding instructor_id:', err.message);
  } else {
    console.log('✅ Added instructor_id column');
  }
  
  // Add created_at column
  db.run('ALTER TABLE courses ADD COLUMN created_at TEXT', (err) => {
    if (err && err.message.includes('duplicate column name')) {
      console.log('✅ created_at column already exists');
    } else if (err) {
      console.log('Error adding created_at:', err.message);
    } else {
      console.log('✅ Added created_at column');
    }
    
    // Add amount_paid column to enrollments
    db.run('ALTER TABLE enrollments ADD COLUMN amount_paid REAL DEFAULT 0', (err) => {
      if (err && err.message.includes('duplicate column name')) {
        console.log('✅ amount_paid column already exists');
      } else if (err) {
        console.log('Error adding amount_paid:', err.message);
      } else {
        console.log('✅ Added amount_paid column');
        // Update existing enrollments with course price
        db.run('UPDATE enrollments SET amount_paid = (SELECT price FROM courses WHERE courses.id = enrollments.course_id)');
      }
      
      console.log('\n✅ Database migration complete!');
      db.close();
    });
  });
});