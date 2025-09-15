const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create students table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    level TEXT NOT NULL,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending'
  )`);
});

// API Routes
app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students ORDER BY enrollment_date DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/enroll', (req, res) => {
  const { name, age, email, phone, level } = req.body;
  
  if (!name || !age || !email || !phone || !level) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `INSERT INTO students (name, age, email, phone, level) VALUES (?, ?, ?, ?, ?)`;
  const params = [name, age, email, phone, level];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Enrollment submitted successfully!',
      id: this.lastID
    });
  });
});

app.get('/api/stats', (req, res) => {
  const stats = {
    total: 0,
    byLevel: {},
    recent: 0
  };

  // Get total students
  db.get('SELECT COUNT(*) as count FROM students', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    stats.total = row.count;

    // Get count by level
    db.all('SELECT level, COUNT(*) as count FROM students GROUP BY level', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      rows.forEach(row => {
        stats.byLevel[row.level] = row.count;
      });

      // Get recent enrollments (last 7 days)
      db.get(`SELECT COUNT(*) as count FROM students 
              WHERE enrollment_date > datetime('now', '-7 days')`, (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        stats.recent = row.count;

        res.json(stats);
      });
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
