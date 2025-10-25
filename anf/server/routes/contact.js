const express = require('express');
const Database = require('../models/database');
const ContactInquiry = require('../models/ContactInquiry');
const EmailService = require('../services/emailService');
const { validateContactInquiry } = require('../middleware/validation');

const router = express.Router();

// Initialize database connection and email service
const db = new Database();
const emailService = new EmailService();

// Submit contact inquiry
router.post('/inquiry', validateContactInquiry, async (req, res) => {
  try {
    await db.connect();
    const contactModel = new ContactInquiry(db);

    const { name, email, phone, program, message } = req.body;

    // Create contact inquiry
    const result = await contactModel.create({
      name,
      email,
      phone,
      program,
      message,
      status: 'new'
    });

    // Send email notifications
    const contactData = {
      id: result.id,
      name,
      email,
      phone,
      program,
      message,
      status: 'new'
    };

    // Send response email to user
    await emailService.sendContactResponse(contactData);

    // Send notification to admin
    await emailService.sendAdminContactNotification(contactData);

    res.status(201).json({
      message: 'Contact inquiry submitted successfully',
      inquiryId: result.id
    });

  } catch (error) {
    console.error('Contact inquiry error:', error);
    res.status(500).json({
      error: 'Internal server error while submitting inquiry'
    });
  } finally {
    await db.close();
  }
});

// Get all contact inquiries (admin only)
router.get('/inquiries', async (req, res) => {
  try {
    await db.connect();
    const contactModel = new ContactInquiry(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const filters = {
      status: req.query.status,
      program: req.query.program,
      search: req.query.search
    };

    const inquiries = await contactModel.getAll(limit, offset, filters);

    res.json({
      inquiries,
      pagination: {
        limit,
        offset,
        hasMore: inquiries.length === limit
      }
    });

  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching inquiries'
    });
  } finally {
    await db.close();
  }
});

// Get contact inquiry by ID
router.get('/inquiry/:id', async (req, res) => {
  try {
    await db.connect();
    const contactModel = new ContactInquiry(db);

    const inquiry = await contactModel.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        error: 'Contact inquiry not found'
      });
    }

    res.json({ inquiry });

  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching inquiry'
    });
  } finally {
    await db.close();
  }
});

// Update inquiry status
router.put('/inquiry/:id/status', async (req, res) => {
  try {
    await db.connect();
    const contactModel = new ContactInquiry(db);

    const { status } = req.body;

    if (!['new', 'in_progress', 'responded', 'closed'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: new, in_progress, responded, closed'
      });
    }

    const result = await contactModel.updateStatus(req.params.id, status);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Contact inquiry not found'
      });
    }

    res.json({
      message: 'Inquiry status updated successfully'
    });

  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({
      error: 'Internal server error while updating inquiry status'
    });
  } finally {
    await db.close();
  }
});

// Mark inquiry as in progress
router.put('/inquiry/:id/in-progress', async (req, res) => {
  try {
    await db.connect();
    const contactModel = new ContactInquiry(db);

    await contactModel.markAsInProgress(req.params.id);

    res.json({
      message: 'Inquiry marked as in progress'
    });

  } catch (error) {
    console.error('Mark as in progress error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  } finally {
    await db.close();
  }
});

// Mark inquiry as responded
router.put('/inquiry/:id/responded', async (req, res) => {
  try {
    await db.connect();
    const contactModel = new ContactInquiry(db);

    await contactModel.markAsResponded(req.params.id);

    res.json({
      message: 'Inquiry marked as responded'
    });

  } catch (error) {
    console.error('Mark as responded error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  } finally {
    await db.close();
  }
});

// Get contact inquiry statistics
router.get('/inquiries/stats', async (req, res) => {
  try {
    await db.connect();
    const contactModel = new ContactInquiry(db);

    const stats = await contactModel.getStats();

    res.json({ stats });

  } catch (error) {
    console.error('Get inquiry stats error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching statistics'
    });
  } finally {
    await db.close();
  }
});

// Get inquiries by status
router.get('/inquiries/status/:status', async (req, res) => {
  try {
    await db.connect();
    const contactModel = new ContactInquiry(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const inquiries = await contactModel.getByStatus(req.params.status, limit, offset);

    res.json({
      inquiries,
      pagination: {
        limit,
        offset,
        hasMore: inquiries.length === limit
      }
    });

  } catch (error) {
    console.error('Get inquiries by status error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching inquiries'
    });
  } finally {
    await db.close();
  }
});

// Get inquiries by program
router.get('/inquiries/program/:program', async (req, res) => {
  try {
    await db.connect();
    const contactModel = new ContactInquiry(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const inquiries = await contactModel.getByProgram(req.params.program, limit, offset);

    res.json({
      inquiries,
      pagination: {
        limit,
        offset,
        hasMore: inquiries.length === limit
      }
    });

  } catch (error) {
    console.error('Get inquiries by program error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching inquiries'
    });
  } finally {
    await db.close();
  }
});

module.exports = router;
