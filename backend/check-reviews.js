const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://learnhub_user:Jk6a6VA8u13XaI0gAs4JDkUUhC6JvkTD@dpg-d828b83rjlhs738h3lo0-a.frankfurt-postgres.render.com/learnhub_2hkr',
  ssl: { rejectUnauthorized: false }
});

async function checkReviews() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'reviews'
      );
    `);
    console.log('Reviews table exists:', result.rows[0].exists);
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit();
  }
}

checkReviews();