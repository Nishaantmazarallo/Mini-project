const express = require('express');
const Database = require('../models/database');
const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');
const ContactInquiry = require('../models/ContactInquiry');
const Testimonial = require('../models/Testimonial');
const GalleryImage = require('../models/GalleryImage');

const router = express.Router();

// Initialize database connection
const db = new Database();

// Get comprehensive dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    await db.connect();

    const userModel = new User(db);
    const studentModel = new Student(db);
    const courseModel = new Course(db);
    const contactModel = new ContactInquiry(db);
    const testimonialModel = new Testimonial(db);
    const galleryModel = new GalleryImage(db);

    // Get all statistics
    const [
      userStats,
      studentStats,
      courseStats,
      contactStats,
      testimonialStats,
      galleryStats
    ] = await Promise.all([
      userModel.getStats(),
      studentModel.getStats(),
      courseModel.getStats(),
      contactModel.getStats(),
      testimonialModel.getStats(),
      galleryModel.getStats()
    ]);

    const dashboardData = {
      overview: {
        totalUsers: userStats.total,
        totalStudents: studentStats.total,
        totalCourses: courseStats.total,
        totalInquiries: contactStats.total,
        totalTestimonials: testimonialStats.total,
        totalGalleryImages: galleryStats.total
      },
      recentActivity: {
        recentStudents: await studentModel.getAll(5, 0),
        recentInquiries: await contactModel.getAll(5, 0),
        recentTestimonials: await testimonialModel.getAll(5, 0),
        recentCourses: await courseModel.getAll(5, 0)
      },
      statusBreakdown: {
        studentsByStatus: studentStats.byStatus,
        inquiriesByStatus: contactStats.byStatus,
        coursesByCategory: courseStats.byCategory,
        testimonialsByRating: testimonialStats.byRating
      },
      trends: {
        newStudentsThisWeek: studentStats.recent,
        newInquiriesThisWeek: contactStats.recent,
        newTestimonialsThisWeek: testimonialStats.recent
      }
    };

    res.json({ dashboardData });

  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching dashboard data'
    });
  } finally {
    await db.close();
  }
});

// Get user analytics
router.get('/analytics/users', async (req, res) => {
  try {
    await db.connect();
    const userModel = new User(db);

    const analytics = await userModel.getAnalytics();

    res.json({ analytics });

  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching user analytics'
    });
  } finally {
    await db.close();
  }
});

// Get enrollment analytics
router.get('/analytics/enrollments', async (req, res) => {
  try {
    await db.connect();
    const studentModel = new Student(db);

    const analytics = await studentModel.getEnrollmentAnalytics();

    res.json({ analytics });

  } catch (error) {
    console.error('Get enrollment analytics error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching enrollment analytics'
    });
  } finally {
    await db.close();
  }
});

// Get course performance data
router.get('/analytics/courses', async (req, res) => {
  try {
    await db.connect();
    const courseModel = new Course(db);

    const analytics = await courseModel.getPerformanceAnalytics();

    res.json({ analytics });

  } catch (error) {
    console.error('Get course analytics error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching course analytics'
    });
  } finally {
    await db.close();
  }
});

// Get system health metrics
router.get('/health/metrics', async (req, res) => {
  try {
    await db.connect();

    const healthMetrics = {
      database: {
        status: 'healthy',
        lastBackup: new Date().toISOString(),
        size: '2.1 MB'
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      },
      endpoints: {
        totalRequests: 0, // This would be tracked with proper monitoring
        averageResponseTime: 0,
        errorRate: 0
      }
    };

    res.json({ healthMetrics });

  } catch (error) {
    console.error('Get health metrics error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching health metrics'
    });
  } finally {
    await db.close();
  }
});

// Get all system logs (simplified for demo)
router.get('/logs/system', async (req, res) => {
  try {
    // In a real application, this would fetch from a logging system
    const logs = [
      {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'Server started successfully',
        source: 'server.js'
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: 'INFO',
        message: 'Database connection established',
        source: 'database.js'
      }
    ];

    res.json({ logs });

  } catch (error) {
    console.error('Get system logs error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching system logs'
    });
  }
});

module.exports = router;
