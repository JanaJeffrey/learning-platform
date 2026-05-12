const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./learning-platform.db');

// Check current table structure
db.all('PRAGMA table_info(enrollments)', [], (err, columns) => {
  console.log('Current columns:', columns.map(c => c.name).join(', '));
  
  // Add missing columns if needed
  db.run('ALTER TABLE enrollments ADD COLUMN amount_paid REAL DEFAULT 0', (err) => {
    if (err && !err.message.includes('duplicate')) {
      console.log('Error adding amount_paid:', err.message);
    } else {
      console.log('✅ amount_paid column ready');
    }
    
    db.run('ALTER TABLE enrollments ADD COLUMN payment_status TEXT DEFAULT "completed"', (err) => {
      if (err && !err.message.includes('duplicate')) {
        console.log('Error adding payment_status:', err.message);
      } else {
        console.log('✅ payment_status column ready');
      }
      
      // Update any existing enrollments with amount from courses
      db.run(`UPDATE enrollments SET amount_paid = (
        SELECT price FROM courses WHERE courses.id = enrollments.course_id
      ) WHERE amount_paid IS NULL OR amount_paid = 0`, (err) => {
        console.log('✅ Updated existing enrollments');
        db.close(() => console.log('\n✅ Fix complete! Restart your backend.'));
      });
    });
  });
});