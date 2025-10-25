class ContactInquiry {
  constructor(db) {
    this.db = db;
  }

  async create(inquiryData) {
    const {
      name,
      email,
      phone,
      program,
      message,
      status = 'new'
    } = inquiryData;

    const sql = `
      INSERT INTO contact_inquiries (name, email, phone, program, message, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [name, email, phone, program, message, status];
    const result = await this.db.run(sql, params);
    return result;
  }

  async findById(id) {
    const sql = 'SELECT * FROM contact_inquiries WHERE id = ?';
    return await this.db.get(sql, [id]);
  }

  async getAll(limit = 100, offset = 0, filters = {}) {
    let sql = 'SELECT * FROM contact_inquiries WHERE 1=1';
    let params = [];

    // Apply filters
    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.program) {
      sql += ' AND program = ?';
      params.push(filters.program);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR message LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await this.db.all(sql, params);
  }

  async updateStatus(id, status) {
    const sql = 'UPDATE contact_inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.db.run(sql, [status, id]);
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
    const sql = `UPDATE contact_inquiries SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    return await this.db.run(sql, params);
  }

  async delete(id) {
    const sql = 'DELETE FROM contact_inquiries WHERE id = ?';
    return await this.db.run(sql, [id]);
  }

  async getStats() {
    const stats = {
      total: 0,
      byStatus: {},
      byProgram: {},
      recent: 0
    };

    // Get total inquiries
    const totalResult = await this.db.get('SELECT COUNT(*) as count FROM contact_inquiries');
    stats.total = totalResult.count;

    // Get count by status
    const statusResult = await this.db.all('SELECT status, COUNT(*) as count FROM contact_inquiries GROUP BY status');
    statusResult.forEach(row => {
      stats.byStatus[row.status] = row.count;
    });

    // Get count by program
    const programResult = await this.db.all('SELECT program, COUNT(*) as count FROM contact_inquiries GROUP BY program');
    programResult.forEach(row => {
      stats.byProgram[row.program] = row.count;
    });

    // Get recent inquiries (last 7 days)
    const recentResult = await this.db.get(`
      SELECT COUNT(*) as count FROM contact_inquiries
      WHERE created_at > datetime('now', '-7 days')
    `);
    stats.recent = recentResult.count;

    return stats;
  }

  async getByStatus(status, limit = 100, offset = 0) {
    const sql = 'SELECT * FROM contact_inquiries WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [status, limit, offset]);
  }

  async getByProgram(program, limit = 100, offset = 0) {
    const sql = 'SELECT * FROM contact_inquiries WHERE program = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [program, limit, offset]);
  }

  async markAsResponded(id) {
    return await this.updateStatus(id, 'responded');
  }

  async markAsInProgress(id) {
    return await this.updateStatus(id, 'in_progress');
  }
}

module.exports = ContactInquiry;
