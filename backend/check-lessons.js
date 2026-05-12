const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./learning-platform.db');

console.log('\n📚 ALL LESSONS IN DATABASE:\n');
console.log('='.repeat(60));

db.all(`
  SELECT l.*, c.title as course_title 
  FROM lessons l 
  JOIN courses c ON l.course_id = c.id 
  ORDER BY l.course_id, l.order_num
`, [], (err, lessons) => {
  let currentCourse = '';
  lessons.forEach(lesson => {
    if (currentCourse !== lesson.course_title) {
      currentCourse = lesson.course_title;
      console.log(`\n📖 ${currentCourse}:`);
      console.log('-'.repeat(40));
    }
    console.log(`   ${lesson.order_num}. ${lesson.title} (${lesson.duration}s) - ${lesson.is_preview ? '🔓 Preview' : '🔒 Locked'}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Total lessons: ${lessons.length}`);
  
  db.close();
});