/**
 * Fact Check Routes
 */

const express = require('express');
const router = express.Router();
const factCheckController = require('../controllers/factCheckController');

// Fact check from screenshot
router.post('/screenshot', factCheckController.checkFromScreenshot.bind(factCheckController));

// Fact check from text
router.post('/text', factCheckController.checkFromText.bind(factCheckController));

// Get fact check history
router.get('/history', factCheckController.getHistory.bind(factCheckController));

// Get statistics
router.get('/stats', factCheckController.getStats.bind(factCheckController));

// Get specific fact check by ID
router.get('/:id', factCheckController.getById.bind(factCheckController));

module.exports = router;
