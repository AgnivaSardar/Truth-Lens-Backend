/**
 * RAG Routes
 */

const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');

// Search for information
router.post('/search', ragController.search.bind(ragController));

// Get search history
router.get('/history', ragController.getHistory.bind(ragController));

// Index new content
router.post('/index', ragController.indexContent.bind(ragController));

module.exports = router;
