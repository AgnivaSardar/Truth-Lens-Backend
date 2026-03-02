/**
 * Speech Routes
 */

const express = require('express');
const router = express.Router();
const speechController = require('../controllers/speechController');

// Text to speech
router.post('/text-to-speech', speechController.textToSpeech.bind(speechController));

// Speech to text
router.post('/speech-to-text', speechController.speechToText.bind(speechController));

// Speech to text with translation
router.post('/speech-to-text-translate', speechController.speechToTextWithTranslation.bind(speechController));

module.exports = router;
