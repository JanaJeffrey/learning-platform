const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://learnhub_user:Jk6a6VA8u13XaI0gAs4JDkUUhC6JvkTD@dpg-d828b83rjlhs738h3lo0-a.frankfurt-postgres.render.com/learnhub_2hkr',
  ssl: { rejectUnauthorized: false }
});

async function createNotificationsTable() {
  try {
    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        link TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Notifications table created');

    // Create index for faster queries
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)');
    console.log('✅ Indexes created');

    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit();
  }
}

createNotificationsTable();