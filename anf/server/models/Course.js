class Course {
  constructor(db) {
    this.db = db;
  }

  async create(courseData) {
    const {
      title,
      description,
      category,
      level,
      duration,
      price,
      max_students,
      schedule,
      is_active = true
    } = courseData;

    const sql = `
      INSERT INTO courses (
        title, description, category, level, duration,
        price, max_students, schedule, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      title, description, category, level, duration,
      price, max_students, schedule, is_active ? 1 : 0
    ];

    const result = await this.db.run(sql, params);
    return result;
  }

  async findById(id) {
    const sql = 'SELECT * FROM courses WHERE id = ?';
    return await this.db.get(sql, [id]);
  }

  async getAll(limit = 100, offset = 0, filters = {}) {
    let sql = 'SELECT * FROM courses WHERE 1=1';
    let params = [];

    // Apply filters
    if (filters.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.level) {
      sql += ' AND level = ?';
      params.push(filters.level);
    }

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active ? 1 : 0);
    }

    if (filters.search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await this.db.all(sql, params);
  }

  async update(id, updates) {
    const fields = [];
    const params = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'is_active') {
          fields.push(`${key} = ?`);
          params.push(updates[key] ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          params.push(updates[key]);
        }
      }
    });

    if (fields.length === 0) return { changes: 0 };

    fields.push('updated_at = CURRENT_TIMESTAMP');
    const sql = `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    return await this.db.run(sql, params);
  }

  async delete(id) {
    const sql = 'DELETE FROM courses WHERE id = ?';
    return await this.db.run(sql, [id]);
  }

  async toggleActive(id) {
    const course = await this.findById(id);
    if (!course) return { changes: 0 };

    const sql = 'UPDATE courses SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.db.run(sql, [course.is_active ? 0 : 1, id]);
  }

  async getByCategory(category, limit = 100, offset = 0) {
    const sql = 'SELECT * FROM courses WHERE category = ? AND is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [category, limit, offset]);
  }

  async getByLevel(level, limit = 100, offset = 0) {
    const sql = 'SELECT * FROM courses WHERE level = ? AND is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [level, limit, offset]);
  }

  async getActiveCourses(limit = 100, offset = 0) {
    const sql = 'SELECT * FROM courses WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [limit, offset]);
  }

  async getStats() {
    const stats = {
      total: 0,
      active: 0,
      byCategory: {},
      byLevel: {}
    };

    // Get total courses
    const totalResult = await this.db.get('SELECT COUNT(*) as count FROM courses');
    stats.total = totalResult.count;

    // Get active courses
    const activeResult = await this.db.get('SELECT COUNT(*) as count FROM courses WHERE is_active = 1');
    stats.active = activeResult.count;

    // Get count by category
    const categoryResult = await this.db.all('SELECT category, COUNT(*) as count FROM courses GROUP BY category');
    categoryResult.forEach(row => {
      stats.byCategory[row.category] = row.count;
    });

    // Get count by level
    const levelResult = await this.db.all('SELECT level, COUNT(*) as count FROM courses GROUP BY level');
    levelResult.forEach(row => {
      stats.byLevel[row.level] = row.count;
    });

    return stats;
  }
}

module.exports = Course;
