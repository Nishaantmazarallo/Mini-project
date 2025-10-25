class GalleryImage {
  constructor(db) {
    this.db = db;
  }

  async create(imageData) {
    const {
      filename,
      original_name,
      mime_type,
      size,
      path,
      category,
      description,
      is_active = true
    } = imageData;

    const sql = `
      INSERT INTO gallery_images (
        filename, original_name, mime_type, size, path,
        category, description, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      filename, original_name, mime_type, size, path,
      category, description, is_active ? 1 : 0
    ];

    const result = await this.db.run(sql, params);
    return result;
  }

  async findById(id) {
    const sql = 'SELECT * FROM gallery_images WHERE id = ?';
    return await this.db.get(sql, [id]);
  }

  async getAll(limit = 100, offset = 0, filters = {}) {
    let sql = 'SELECT * FROM gallery_images WHERE 1=1';
    let params = [];

    // Apply filters
    if (filters.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active ? 1 : 0);
    }

    if (filters.search) {
      sql += ' AND (original_name LIKE ? OR description LIKE ?)';
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
    const sql = `UPDATE gallery_images SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    return await this.db.run(sql, params);
  }

  async delete(id) {
    // First get the image to delete the file
    const image = await this.findById(id);
    if (!image) return { changes: 0 };

    const sql = 'DELETE FROM gallery_images WHERE id = ?';
    const result = await this.db.run(sql, [id]);

    // Note: In a real application, you would also delete the physical file here
    // const fs = require('fs').promises;
    // await fs.unlink(image.path);

    return result;
  }

  async toggleActive(id) {
    const image = await this.findById(id);
    if (!image) return { changes: 0 };

    const sql = 'UPDATE gallery_images SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.db.run(sql, [image.is_active ? 0 : 1, id]);
  }

  async getByCategory(category, limit = 100, offset = 0) {
    const sql = 'SELECT * FROM gallery_images WHERE category = ? AND is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [category, limit, offset]);
  }

  async getActiveImages(limit = 100, offset = 0) {
    const sql = 'SELECT * FROM gallery_images WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
    return await this.db.all(sql, [limit, offset]);
  }

  async getCategories() {
    const sql = 'SELECT category, COUNT(*) as count FROM gallery_images WHERE is_active = 1 GROUP BY category ORDER BY category';
    return await this.db.all(sql);
  }

  async getStats() {
    const stats = {
      total: 0,
      active: 0,
      byCategory: {},
      totalSize: 0
    };

    // Get total images
    const totalResult = await this.db.get('SELECT COUNT(*) as count FROM gallery_images');
    stats.total = totalResult.count;

    // Get active images
    const activeResult = await this.db.get('SELECT COUNT(*) as count FROM gallery_images WHERE is_active = 1');
    stats.active = activeResult.count;

    // Get count by category
    const categoryResult = await this.db.all('SELECT category, COUNT(*) as count FROM gallery_images GROUP BY category');
    categoryResult.forEach(row => {
      stats.byCategory[row.category] = row.count;
    });

    // Get total size
    const sizeResult = await this.db.get('SELECT SUM(size) as total_size FROM gallery_images');
    stats.totalSize = sizeResult.total_size || 0;

    return stats;
  }

  async searchImages(query, limit = 100, offset = 0) {
    const sql = `
      SELECT * FROM gallery_images
      WHERE is_active = 1
      AND (original_name LIKE ? OR description LIKE ?)
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const searchTerm = `%${query}%`;
    return await this.db.all(sql, [searchTerm, searchTerm, limit, offset]);
  }

  async getRecentImages(limit = 10) {
    const sql = 'SELECT * FROM gallery_images WHERE is_active = 1 ORDER BY created_at DESC LIMIT ?';
    return await this.db.all(sql, [limit]);
  }
}

module.exports = GalleryImage;
