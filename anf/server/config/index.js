require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration
  database: {
    path: process.env.DATABASE_PATH || './database.sqlite'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'ANF Academy <noreply@anfacademy.com>'
  },

  // File Upload Configuration
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxSize: process.env.MAX_FILE_SIZE || '5MB',
    allowedTypes: process.env.ALLOWED_FILE_TYPES ?
      process.env.ALLOWED_FILE_TYPES.split(',') :
      ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },

  // Security Configuration
  security: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    }
  },

  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS ?
      process.env.ALLOWED_ORIGINS.split(',') :
      ['http://localhost:3000', 'http://localhost:3001']
  },

  // Admin Configuration
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@anfacademy.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  }
};

module.exports = config;
