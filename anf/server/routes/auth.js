const express = require('express');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const Database = require('../models/database');
const User = require('../models/User');
const {
  validateUserRegistration,
  validateUserLogin,
  handleValidationErrors
} = require('../middleware/validation');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Initialize database connection
const db = new Database();

// User Registration
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    await db.connect();
    const userModel = new User(db);

    const { email, password, name, role } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const result = await userModel.create({
      email,
      password,
      name,
      role: role || 'student'
    });

    // Generate JWT token
    const newUser = await userModel.findById(result.id);
    const token = await userModel.generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error during registration'
    });
  } finally {
    await db.close();
  }
});

// User Login
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    await db.connect();
    const userModel = new User(db);

    const { email, password } = req.body;

    // Authenticate user
    const user = await userModel.authenticate(email, password);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = await userModel.generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login'
    });
  } finally {
    await db.close();
  }
});

// Get current user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        created_at: req.user.created_at
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', requireAuth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  handleValidationErrors
], async (req, res) => {
  try {
    await db.connect();
    const userModel = new User(db);

    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'Email is already taken by another user'
        });
      }
    }

    // Update user profile
    const result = await userModel.updateProfile(req.user.id, { name, email });

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Get updated user data
    const updatedUser = await userModel.findById(req.user.id);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Internal server error during profile update'
    });
  } finally {
    await db.close();
  }
});

// Change password
router.put('/change-password', requireAuth, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
], async (req, res) => {
  try {
    await db.connect();
    const userModel = new User(db);

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const user = await userModel.findById(req.user.id);
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Current password is incorrect'
      });
    }

    // Update password
    await userModel.updatePassword(req.user.id, newPassword);

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      error: 'Internal server error during password change'
    });
  } finally {
    await db.close();
  }
});

// Get all users (admin only)
router.get('/users', requireAuth, async (req, res) => {
  try {
    await db.connect();
    const userModel = new User(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const users = await userModel.getAllUsers(limit, offset);

    res.json({
      users,
      pagination: {
        limit,
        offset,
        hasMore: users.length === limit
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  } finally {
    await db.close();
  }
});

module.exports = router;
