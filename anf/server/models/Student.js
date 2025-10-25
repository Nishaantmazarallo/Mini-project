class Student {
  constructor(db) {
    this.db = db;
  }

  async create(studentData) {
    const {
      user_id,
      name,
      age,
      email,
      phone,
      level,
      parent_name,
      parent_phone,
      address,
      status = 'pending',
      notes
    } = studentData;

    const sql = `
      INSERT INTO students (
        user_id, name, age, email, phone, level,
        parent_name, parent_phone, address, status, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      user_id, name, age, email, phone, level,
      parent_name, parent_phone, address, status, notes
    ];

    const result = await this.db.run(sql, params);
    return result;
  }

  async findById(id) {
    const sql = 'SELECT * FROM students WHERE id = ?';
    return await this.db.get(sql, [id]);
  }

  async findByEmail(email) {
    const sql = 'SELECT * FROM students WHERE email = ?';
    return await this.db.get(sql, [email]);
  }

  async getAll(limit = 100, offset = 0, filters = {}) {
    let sql = 'SELECT * FROM students WHERE 1=1';
    let params = [];

    // Apply filters
    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.level) {
      sql += ' AND level = ?';
      params.push(filters.level);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY enrollment_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await this.db.all(sql, params);
  }

  async update(id, updates) {
    const fields = [];
    const params = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    });

    if (fields.length === 0) return { changes: 0 };

    fields.push('updated_at = CURRENT_TIMESTAMP');
    const sql = `UPDATE students SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    return await this.db.run(sql, params);
  }

  async updateStatus(id, status) {
    const sql = 'UPDATE students SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.db.run(sql, [status, id]);
  }

  async delete(id) {
    const sql = 'DELETE FROM students WHERE id = ?';
    return await this.db.run(sql, [id]);
  }

  async getStats() {
    const stats = {
      total: 0,
      byStatus: {},
      byLevel: {},
      recent: 0
    };

    // Get total students
    const totalResult = await this.db.get('SELECT COUNT(*) as count FROM students');
    stats.total = totalResult.count;

    // Get count by status
    const statusResult = await this.db.all('SELECT status, COUNT(*) as count FROM students GROUP BY status');
    statusResult.forEach(row => {
      stats.byStatus[row.status] = row.count;
    });

    // Get count by level
    const levelResult = await this.db.all('SELECT level, COUNT(*) as count FROM students GROUP BY level');
    levelResult.forEach(row => {
      stats.byLevel[row.level] = row.count;
    });

    // Get recent enrollments (last 7 days)
    const recentResult = await this.db.get(`
      SELECT COUNT(*) as count FROM students
      WHERE enrollment_date > datetime('now', '-7 days')
    `);
    stats.recent = recentResult.count;

    return stats;
  }

  async getByLevel(level, limit = 100, offset = 0) {
    const sql = 'SELECT * FROM students WHERE level = ? ORDER BY enrollment_date DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [level, limit, offset]);
  }

  async getByStatus(status, limit = 100, offset = 0) {
    const sql = 'SELECT * FROM students WHERE status = ? ORDER BY enrollment_date DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [status, limit, offset]);
  }
}

module.exports = Student;
