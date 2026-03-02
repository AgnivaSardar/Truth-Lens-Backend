/**
 * Translation Routes
 */

const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');

// Translate text
router.post('/', translationController.translate.bind(translationController));

// Detect language
router.post('/detect', translationController.detectLanguage.bind(translationController));

// Batch translate
router.post('/batch', translationController.batchTranslate.bind(translationController));

module.exports = router;
