const express = require('express');
const Database = require('../models/database');
const Testimonial = require('../models/Testimonial');
const { validateTestimonial } = require('../middleware/validation');

const router = express.Router();

// Initialize database connection
const db = new Database();

// Submit testimonial
router.post('/', validateTestimonial, async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const { name, email, role, message, rating } = req.body;

    const result = await testimonialModel.create({
      name,
      email,
      role,
      message,
      rating,
      is_approved: false // New testimonials need approval
    });

    res.status(201).json({
      message: 'Testimonial submitted successfully and is pending approval',
      testimonialId: result.id
    });

  } catch (error) {
    console.error('Submit testimonial error:', error);
    res.status(500).json({
      error: 'Internal server error while submitting testimonial'
    });
  } finally {
    await db.close();
  }
});

// Get all testimonials (admin view)
router.get('/', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const filters = {
      is_approved: req.query.is_approved !== undefined ? req.query.is_approved === 'true' : undefined,
      rating: req.query.rating,
      search: req.query.search
    };

    const testimonials = await testimonialModel.getAll(limit, offset, filters);

    res.json({
      testimonials,
      pagination: {
        limit,
        offset,
        hasMore: testimonials.length === limit
      }
    });

  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching testimonials'
    });
  } finally {
    await db.close();
  }
});

// Get approved testimonials (public view)
router.get('/approved/list', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const testimonials = await testimonialModel.getApproved(limit, offset);

    res.json({
      testimonials,
      pagination: {
        limit,
        offset,
        hasMore: testimonials.length === limit
      }
    });

  } catch (error) {
    console.error('Get approved testimonials error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching approved testimonials'
    });
  } finally {
    await db.close();
  }
});

// Get pending testimonials (admin view)
router.get('/pending/list', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const testimonials = await testimonialModel.getPending(limit, offset);

    res.json({
      testimonials,
      pagination: {
        limit,
        offset,
        hasMore: testimonials.length === limit
      }
    });

  } catch (error) {
    console.error('Get pending testimonials error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching pending testimonials'
    });
  } finally {
    await db.close();
  }
});

// Get testimonial by ID
router.get('/:id', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const testimonial = await testimonialModel.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        error: 'Testimonial not found'
      });
    }

    res.json({ testimonial });

  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching testimonial'
    });
  } finally {
    await db.close();
  }
});

// Approve testimonial
router.put('/:id/approve', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const result = await testimonialModel.approve(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Testimonial not found'
      });
    }

    res.json({
      message: 'Testimonial approved successfully'
    });

  } catch (error) {
    console.error('Approve testimonial error:', error);
    res.status(500).json({
      error: 'Internal server error while approving testimonial'
    });
  } finally {
    await db.close();
  }
});

// Reject testimonial
router.put('/:id/reject', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const result = await testimonialModel.reject(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Testimonial not found'
      });
    }

    res.json({
      message: 'Testimonial rejected'
    });

  } catch (error) {
    console.error('Reject testimonial error:', error);
    res.status(500).json({
      error: 'Internal server error while rejecting testimonial'
    });
  } finally {
    await db.close();
  }
});

// Update testimonial
router.put('/:id', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const updates = req.body;
    const result = await testimonialModel.update(req.params.id, updates);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Testimonial not found'
      });
    }

    res.json({
      message: 'Testimonial updated successfully'
    });

  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      error: 'Internal server error while updating testimonial'
    });
  } finally {
    await db.close();
  }
});

// Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const result = await testimonialModel.delete(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Testimonial not found'
      });
    }

    res.json({
      message: 'Testimonial deleted successfully'
    });

  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting testimonial'
    });
  } finally {
    await db.close();
  }
});

// Get testimonials by rating
router.get('/rating/:rating', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const testimonials = await testimonialModel.getByRating(req.params.rating, limit, offset);

    res.json({
      testimonials,
      pagination: {
        limit,
        offset,
        hasMore: testimonials.length === limit
      }
    });

  } catch (error) {
    console.error('Get testimonials by rating error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching testimonials'
    });
  } finally {
    await db.close();
  }
});

// Get testimonial statistics
router.get('/stats/overview', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const stats = await testimonialModel.getStats();

    res.json({ stats });

  } catch (error) {
    console.error('Get testimonial stats error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching statistics'
    });
  } finally {
    await db.close();
  }
});

// Get random approved testimonials (for homepage display)
router.get('/random/approved', async (req, res) => {
  try {
    await db.connect();
    const testimonialModel = new Testimonial(db);

    const limit = parseInt(req.query.limit) || 3;
    const testimonials = await testimonialModel.getRandomApproved(limit);

    res.json({ testimonials });

  } catch (error) {
    console.error('Get random testimonials error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching random testimonials'
    });
  } finally {
    await db.close();
  }
});

module.exports = router;
