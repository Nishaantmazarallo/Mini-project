class Testimonial {
  constructor(db) {
    this.db = db;
  }

  async create(testimonialData) {
    const {
      name,
      email,
      role,
      message,
      rating,
      is_approved = false
    } = testimonialData;

    const sql = `
      INSERT INTO testimonials (name, email, role, message, rating, is_approved)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [name, email, role, message, rating, is_approved ? 1 : 0];
    const result = await this.db.run(sql, params);
    return result;
  }

  async findById(id) {
    const sql = 'SELECT * FROM testimonials WHERE id = ?';
    return await this.db.get(sql, [id]);
  }

  async getAll(limit = 100, offset = 0, filters = {}) {
    let sql = 'SELECT * FROM testimonials WHERE 1=1';
    let params = [];

    // Apply filters
    if (filters.is_approved !== undefined) {
      sql += ' AND is_approved = ?';
      params.push(filters.is_approved ? 1 : 0);
    }

    if (filters.rating) {
      sql += ' AND rating = ?';
      params.push(filters.rating);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR message LIKE ?)';
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
        if (key === 'is_approved') {
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
    const sql = `UPDATE testimonials SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    return await this.db.run(sql, params);
  }

  async approve(id) {
    const sql = 'UPDATE testimonials SET is_approved = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.db.run(sql, [id]);
  }

  async reject(id) {
    const sql = 'UPDATE testimonials SET is_approved = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.db.run(sql, [id]);
  }

  async delete(id) {
    const sql = 'DELETE FROM testimonials WHERE id = ?';
    return await this.db.run(sql, [id]);
  }

  async getApproved(limit = 100, offset = 0) {
    const sql = 'SELECT * FROM testimonials WHERE is_approved = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [limit, offset]);
  }

  async getPending(limit = 100, offset = 0) {
    const sql = 'SELECT * FROM testimonials WHERE is_approved = 0 ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [limit, offset]);
  }

  async getByRating(rating, limit = 100, offset = 0) {
    const sql = 'SELECT * FROM testimonials WHERE rating = ? AND is_approved = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [rating, limit, offset]);
  }

  async getStats() {
    const stats = {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      averageRating: 0,
      byRating: {}
    };

    // Get total testimonials
    const totalResult = await this.db.get('SELECT COUNT(*) as count FROM testimonials');
    stats.total = totalResult.count;

    // Get approved testimonials
    const approvedResult = await this.db.get('SELECT COUNT(*) as count FROM testimonials WHERE is_approved = 1');
    stats.approved = approvedResult.count;

    // Get pending testimonials
    const pendingResult = await this.db.get('SELECT COUNT(*) as count FROM testimonials WHERE is_approved = 0');
    stats.pending = pendingResult.count;

    // Get average rating
    const avgResult = await this.db.get('SELECT AVG(rating) as avg FROM testimonials WHERE is_approved = 1');
    stats.averageRating = avgResult.avg ? Math.round(avgResult.avg * 10) / 10 : 0;

    // Get count by rating
    const ratingResult = await this.db.all('SELECT rating, COUNT(*) as count FROM testimonials WHERE is_approved = 1 GROUP BY rating');
    ratingResult.forEach(row => {
      stats.byRating[row.rating] = row.count;
    });

    return stats;
  }

  async getRandomApproved(limit = 3) {
    const sql = `
      SELECT * FROM testimonials
      WHERE is_approved = 1
      ORDER BY RANDOM()
      LIMIT ?
    `;
    return await this.db.all(sql, [limit]);
  }
}

module.exports = Testimonial;
