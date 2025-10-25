const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Database = require('../models/database');
const GalleryImage = require('../models/GalleryImage');
const config = require('../config');

const router = express.Router();

// Initialize database connection
const db = new Database();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', config.upload.path);
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxSize
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Upload single image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided'
      });
    }

    await db.connect();
    const galleryModel = new GalleryImage(db);

    const imageData = {
      filename: req.file.filename,
      original_name: req.file.originalname,
      mime_type: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      category: req.body.category,
      description: req.body.description,
      is_active: req.body.is_active !== 'false'
    };

    const result = await galleryModel.create(imageData);

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageId: result.id,
      filename: req.file.filename
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      error: 'Internal server error while uploading image'
    });
  } finally {
    await db.close();
  }
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No image files provided'
      });
    }

    await db.connect();
    const galleryModel = new GalleryImage(db);

    const results = [];
    for (const file of req.files) {
      const imageData = {
        filename: file.filename,
        original_name: file.originalname,
        mime_type: file.mimetype,
        size: file.size,
        path: file.path,
        category: req.body.category,
        description: req.body.description,
        is_active: req.body.is_active !== 'false'
      };

      const result = await galleryModel.create(imageData);
      results.push({
        imageId: result.id,
        filename: file.filename
      });
    }

    res.status(201).json({
      message: `${results.length} images uploaded successfully`,
      images: results
    });

  } catch (error) {
    console.error('Multiple image upload error:', error);
    res.status(500).json({
      error: 'Internal server error while uploading images'
    });
  } finally {
    await db.close();
  }
});

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const filters = {
      category: req.query.category,
      is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
      search: req.query.search
    };

    const images = await galleryModel.getAll(limit, offset, filters);

    res.json({
      images,
      pagination: {
        limit,
        offset,
        hasMore: images.length === limit
      }
    });

  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching gallery images'
    });
  } finally {
    await db.close();
  }
});

// Get active gallery images (public view)
router.get('/active/list', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const images = await galleryModel.getActiveImages(limit, offset);

    res.json({
      images,
      pagination: {
        limit,
        offset,
        hasMore: images.length === limit
      }
    });

  } catch (error) {
    console.error('Get active gallery images error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching active gallery images'
    });
  } finally {
    await db.close();
  }
});

// Get gallery image by ID
router.get('/:id', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const image = await galleryModel.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        error: 'Gallery image not found'
      });
    }

    res.json({ image });

  } catch (error) {
    console.error('Get gallery image error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching gallery image'
    });
  } finally {
    await db.close();
  }
});

// Update gallery image
router.put('/:id', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const updates = req.body;
    const result = await galleryModel.update(req.params.id, updates);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Gallery image not found'
      });
    }

    res.json({
      message: 'Gallery image updated successfully'
    });

  } catch (error) {
    console.error('Update gallery image error:', error);
    res.status(500).json({
      error: 'Internal server error while updating gallery image'
    });
  } finally {
    await db.close();
  }
});

// Delete gallery image
router.delete('/:id', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const result = await galleryModel.delete(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Gallery image not found'
      });
    }

    res.json({
      message: 'Gallery image deleted successfully'
    });

  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting gallery image'
    });
  } finally {
    await db.close();
  }
});

// Toggle gallery image active status
router.put('/:id/toggle-status', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const result = await galleryModel.toggleActive(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Gallery image not found'
      });
    }

    res.json({
      message: 'Gallery image status updated successfully'
    });

  } catch (error) {
    console.error('Toggle gallery image status error:', error);
    res.status(500).json({
      error: 'Internal server error while updating gallery image status'
    });
  } finally {
    await db.close();
  }
});

// Get gallery images by category
router.get('/category/:category', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const images = await galleryModel.getByCategory(req.params.category, limit, offset);

    res.json({
      images,
      pagination: {
        limit,
        offset,
        hasMore: images.length === limit
      }
    });

  } catch (error) {
    console.error('Get gallery images by category error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching gallery images'
    });
  } finally {
    await db.close();
  }
});

// Get gallery categories
router.get('/categories/list', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const categories = await galleryModel.getCategories();

    res.json({ categories });

  } catch (error) {
    console.error('Get gallery categories error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching categories'
    });
  } finally {
    await db.close();
  }
});

// Get gallery statistics
router.get('/stats/overview', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const stats = await galleryModel.getStats();

    res.json({ stats });

  } catch (error) {
    console.error('Get gallery stats error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching statistics'
    });
  } finally {
    await db.close();
  }
});

// Search gallery images
router.get('/search/query', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }

    const images = await galleryModel.searchImages(query, limit, offset);

    res.json({
      images,
      pagination: {
        limit,
        offset,
        hasMore: images.length === limit
      }
    });

  } catch (error) {
    console.error('Search gallery images error:', error);
    res.status(500).json({
      error: 'Internal server error while searching gallery images'
    });
  } finally {
    await db.close();
  }
});

// Get recent gallery images
router.get('/recent/list', async (req, res) => {
  try {
    await db.connect();
    const galleryModel = new GalleryImage(db);

    const limit = parseInt(req.query.limit) || 10;
    const images = await galleryModel.getRecentImages(limit);

    res.json({ images });

  } catch (error) {
    console.error('Get recent gallery images error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching recent gallery images'
    });
  } finally {
    await db.close();
  }
});

module.exports = router;
