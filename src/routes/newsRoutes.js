/**
 * News Routes
 */

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Get all news with filters
router.get('/', newsController.getAllNews.bind(newsController));

// Get high-impact news
router.get('/high-impact', newsController.getHighImpactNews.bind(newsController));

// Get trending news
router.get('/trending', newsController.getTrendingNews.bind(newsController));

// Get hot news
router.get('/hot', newsController.getHotNews.bind(newsController));

// Get viral claims
router.get('/viral', newsController.getViralClaims.bind(newsController));

// Get statistics
router.get('/stats', newsController.getStats.bind(newsController));

// Get news by slug/topic
router.get('/article/:slug', newsController.getNewsBySlug.bind(newsController));

// Get single news by ID
router.get('/:id', newsController.getNewsById.bind(newsController));

// Create news
router.post('/', newsController.createNews.bind(newsController));

// Update news
router.put('/:id', newsController.updateNews.bind(newsController));

// Delete news
router.delete('/:id', newsController.deleteNews.bind(newsController));

module.exports = router;
