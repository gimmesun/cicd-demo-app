const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  port: 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'myapp'
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend is running! 🚀 v2.2',
    timestamp: new Date().toISOString()
  });
});

// Get users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

async function initDB() {
  console.log('try init db');

  try {
    await pool.connect();
    console.log('✅ Connected to Postgres');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100)
      )
    `);

    const count = await pool.query('SELECT COUNT(*) FROM users');
    const rowCount = count.rows[0].count;
    if (Number(rowCount) === 0) {
      await pool.query(`
        INSERT INTO users (name, email) VALUES
        ('Alice', 'alice@example.com'),
        ('Bob', 'bob@example.com'),
        ('Charlie', 'charlie@example.com')
      `);
      console.log('✅ Database initialized with sample data');
    }
  } catch (err) {
    console.log({ err });
    setTimeout(initDB, 5000); // Retry after 5 seconds
  }
}

app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);

  initDB();
});
