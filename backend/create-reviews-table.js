const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://learnhub_user:Jk6a6VA8u13XaI0gAs4JDkUUhC6JvkTD@dpg-d828b83rjlhs738h3lo0-a.frankfurt-postgres.render.com/learnhub_2hkr',
  ssl: { rejectUnauthorized: false }
});

async function createReviewsTable() {
  try {
    // Drop existing table if needed (uncomment if you want to reset)
    // await pool.query('DROP TABLE IF EXISTS reviews');
    
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
    console.log('✅ Reviews table created successfully');
    
    // Create index for faster queries
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON reviews(course_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)');
    console.log('✅ Indexes created');
    
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit();
  }
}

createReviewsTable();