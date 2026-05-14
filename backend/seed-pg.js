const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://learnhub_user:Jk6a6VA8u13XaI0gAs4JDkUUhC6JvkTD@dpg-d828b83rjlhs738h3lo0-a.frankfurt-postgres.render.com/learnhub_2hkr',
  ssl: { rejectUnauthorized: false }
});

const courses = [
  { id: '1', title: 'Complete Web Development', description: 'Learn HTML, CSS, JavaScript, React', price: 0, category: 'Web Development', level: 'beginner', thumbnail: '💻', is_published: 1, total_duration: 40 },
  { id: '2', title: 'Machine Learning A-Z', description: 'Learn ML algorithms, TensorFlow', price: 0, category: 'Data Science', level: 'advanced', thumbnail: '🤖', is_published: 1, total_duration: 50 },
  { id: '3', title: 'Advanced Python', description: 'Master Python programming', price: 49.99, category: 'Programming', level: 'intermediate', thumbnail: '🐍', is_published: 1, total_duration: 35 },
  { id: '4', title: 'UI/UX Design', description: 'Learn Figma and design', price: 39.99, category: 'Design', level: 'beginner', thumbnail: '🎨', is_published: 1, total_duration: 28 },
  { id: '5', title: 'React & Next.js', description: 'Modern web development', price: 59.99, category: 'Web Development', level: 'intermediate', thumbnail: '⚛️', is_published: 1, total_duration: 30 },
  { id: '6', title: 'JavaScript Mastery', description: 'Master JavaScript', price: 0, category: 'Web Development', level: 'beginner', thumbnail: '🟡', is_published: 1, total_duration: 35 }
];

async function seed() {
  try {
    for (const course of courses) {
      await pool.query(`
        INSERT INTO courses (id, title, description, price, category, level, thumbnail, is_published, total_duration)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING
      `, [course.id, course.title, course.description, course.price, course.category, course.level, course.thumbnail, course.is_published, course.total_duration]);
    }
    console.log(`✅ Added ${courses.length} courses`);
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit();
  }
}

seed();