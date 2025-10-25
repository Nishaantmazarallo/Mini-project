const express = require('express');
const Database = require('../models/database');
const Student = require('../models/Student');
const EmailService = require('../services/emailService');
const { validateStudentEnrollment } = require('../middleware/validation');

const router = express.Router();

// Initialize database connection and email service
const db = new Database();
const emailService = new EmailService();

// Create new student enrollment
router.post('/enroll', validateStudentEnrollment, async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

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
      status,
      notes
    } = req.body;

    // Check if student with email already exists
    const existingStudent = await studentModel.findByEmail(email);
    if (existingStudent) {
      return res.status(400).json({
        error: 'Student with this email is already enrolled'
      });
    }

    // Prepare data for creation, setting null for optional/missing fields
    const createData = {
      user_id: user_id || null,
      name,
      age,
      email,
      phone,
      level,
      parent_name: parent_name || null,
      parent_phone: parent_phone || null,
      address: address || null,
      status: status || 'pending',
      notes: notes || null
    };

    // Create new student enrollment
    const result = await studentModel.create(createData);

    // Send email notifications
    const studentData = {
      id: result.id,
      name,
      age,
      email,
      phone,
      level,
      parent_name,
      parent_phone,
      status: status || 'pending'
    };

    // Send confirmation email to student
    await emailService.sendEnrollmentConfirmation(studentData);

    // Send notification to admin
    await emailService.sendAdminEnrollmentNotification(studentData);

    res.status(201).json({
      message: 'Student enrollment submitted successfully',
      studentId: result.id
    });

  } catch (error) {
    console.error('Student enrollment error:', error);
    res.status(500).json({
      error: 'Internal server error while processing enrollment'
    });
  } finally {
    await db.close();
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const filters = {
      status: req.query.status,
      level: req.query.level,
      search: req.query.search
    };

    const students = await studentModel.getAll(limit, offset, filters);

    res.json({
      students,
      pagination: {
        limit,
        offset,
        hasMore: students.length === limit
      }
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching students'
    });
  } finally {
    await db.close();
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

    const student = await studentModel.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    res.json({ student });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching student'
    });
  } finally {
    await db.close();
  }
});

// Update student information
router.put('/:id', async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

    const updates = req.body;
    const result = await studentModel.update(req.params.id, updates);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    res.json({
      message: 'Student information updated successfully'
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      error: 'Internal server error while updating student'
    });
  } finally {
    await db.close();
  }
});

// Update student status
router.put('/:id/status', async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

    const { status } = req.body;

    if (!['pending', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: pending, active, completed, cancelled'
      });
    }

    const result = await studentModel.updateStatus(req.params.id, status);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    res.json({
      message: 'Student status updated successfully'
    });

  } catch (error) {
    console.error('Update student status error:', error);
    res.status(500).json({
      error: 'Internal server error while updating student status'
    });
  } finally {
    await db.close();
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

    const result = await studentModel.delete(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    res.json({
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting student'
    });
  } finally {
    await db.close();
  }
});

// Get student statistics
router.get('/stats/overview', async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

    const stats = await studentModel.getStats();

    res.json({ stats });

  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching statistics'
    });
  } finally {
    await db.close();
  }
});

// Get students by level
router.get('/level/:level', async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const students = await studentModel.getByLevel(req.params.level, limit, offset);

    res.json({
      students,
      pagination: {
        limit,
        offset,
        hasMore: students.length === limit
      }
    });

  } catch (error) {
    console.error('Get students by level error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching students'
    });
  } finally {
    await db.close();
  }
});

// Get students by status
router.get('/status/:status', async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const students = await studentModel.getByStatus(req.params.status, limit, offset);

    res.json({
      students,
      pagination: {
        limit,
        offset,
        hasMore: students.length === limit
      }
    });

  } catch (error) {
    console.error('Get students by status error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching students'
    });
  } finally {
    await db.close();
  }
});

module.exports = router;
