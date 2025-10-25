const express = require('express');
const Database = require('../models/database');
const Course = require('../models/Course');
const { validateCourse } = require('../middleware/validation');

const router = express.Router();

// Initialize database connection
const db = new Database();

// Create new course
router.post('/', validateCourse, async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const {
      title,
      description,
      category,
      level,
      duration,
      price,
      max_students,
      schedule,
      is_active
    } = req.body;

    const result = await courseModel.create({
      title,
      description,
      category,
      level,
      duration,
      price,
      max_students,
      schedule,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({
      message: 'Course created successfully',
      courseId: result.id
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      error: 'Internal server error while creating course'
    });
  } finally {
    await db.close();
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const filters = {
      category: req.query.category,
      level: req.query.level,
      is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
      search: req.query.search
    };

    const courses = await courseModel.getAll(limit, offset, filters);

    res.json({
      courses,
      pagination: {
        limit,
        offset,
        hasMore: courses.length === limit
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching courses'
    });
  } finally {
    await db.close();
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const course = await courseModel.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    res.json({ course });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching course'
    });
  } finally {
    await db.close();
  }
});

// Update course
router.put('/:id', validateCourse, async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const updates = req.body;
    const result = await courseModel.update(req.params.id, updates);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    res.json({
      message: 'Course updated successfully'
    });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      error: 'Internal server error while updating course'
    });
  } finally {
    await db.close();
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const result = await courseModel.delete(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    res.json({
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting course'
    });
  } finally {
    await db.close();
  }
});

// Toggle course active status
router.put('/:id/toggle-status', async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const result = await courseModel.toggleActive(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    res.json({
      message: 'Course status updated successfully'
    });

  } catch (error) {
    console.error('Toggle course status error:', error);
    res.status(500).json({
      error: 'Internal server error while updating course status'
    });
  } finally {
    await db.close();
  }
});

// Get courses by category
router.get('/category/:category', async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const courses = await courseModel.getByCategory(req.params.category, limit, offset);

    res.json({
      courses,
      pagination: {
        limit,
        offset,
        hasMore: courses.length === limit
      }
    });

  } catch (error) {
    console.error('Get courses by category error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching courses'
    });
  } finally {
    await db.close();
  }
});

// Get courses by level
router.get('/level/:level', async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const courses = await courseModel.getByLevel(req.params.level, limit, offset);

    res.json({
      courses,
      pagination: {
        limit,
        offset,
        hasMore: courses.length === limit
      }
    });

  } catch (error) {
    console.error('Get courses by level error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching courses'
    });
  } finally {
    await db.close();
  }
});

// Get active courses only
router.get('/active/list', async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const courses = await courseModel.getActiveCourses(limit, offset);

    res.json({
      courses,
      pagination: {
        limit,
        offset,
        hasMore: courses.length === limit
      }
    });

  } catch (error) {
    console.error('Get active courses error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching active courses'
    });
  } finally {
    await db.close();
  }
});

// Get course statistics
router.get('/stats/overview', async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const stats = await courseModel.getStats();

    res.json({ stats });

  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching statistics'
    });
  } finally {
    await db.close();
  }
});

module.exports = router;
