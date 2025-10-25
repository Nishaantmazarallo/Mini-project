const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

class User {
  constructor(db) {
    this.db = db;
  }

  async create(userData) {
    const { email, password, name, role = 'student' } = userData;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (email, password, name, role, is_active)
      VALUES (?, ?, ?, ?, 1)
    `;

    const result = await this.db.run(sql, [email, hashedPassword, name, role]);
    return result;
  }

  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ? AND is_active = 1';
    return await this.db.get(sql, [email]);
  }

  async findById(id) {
    const sql = 'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ? AND is_active = 1';
    return await this.db.get(sql, [id]);
  }

  async authenticate(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await this.findById(decoded.userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  async updatePassword(userId, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const sql = 'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.db.run(sql, [hashedPassword, userId]);
  }

  async updateProfile(userId, updates) {
    const { name, email } = updates;
    const sql = 'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.db.run(sql, [name, email, userId]);
  }

  async deactivate(userId) {
    const sql = 'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return await this.db.run(sql, [userId]);
  }

  async getAllUsers(limit = 100, offset = 0) {
    const sql = `
      SELECT id, email, name, role, created_at, updated_at
      FROM users
      WHERE is_active = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    return await this.db.all(sql, [limit, offset]);
  }

  async getUsersByRole(role, limit = 100, offset = 0) {
    const sql = `
      SELECT id, email, name, role, created_at, updated_at
      FROM users
      WHERE role = ? AND is_active = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    return await this.db.all(sql, [role, limit, offset]);
  }
}

module.exports = User;
