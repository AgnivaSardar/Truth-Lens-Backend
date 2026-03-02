/**
 * Fact Check Controller
 * Handles the complete fact-checking pipeline:
 * 1. Screenshot -> OCR (text extraction)
 * 2. Text -> Fact checking
 * 3. Result -> Translation (if needed)
 * 4. Result -> Text-to-speech (if needed)
 */

const ocrService = require('../services/ocrService');
const factCheckService = require('../services/factCheckService');
const translationService = require('../services/translationService');
const speechService = require('../services/speechService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FactCheckController {
  /**
   * Complete fact-check pipeline from screenshot
   */
  async checkFromScreenshot(req, res) {
    try {
      const { image, language = 'en', generateAudio = false } = req.body;

      if (!image) {
        return res.status(400).json({
          success: false,
          error: 'Image data is required',
        });
      }

      // Step 1: Extract text from screenshot
      console.log('Step 1: Extracting text from screenshot...');
      const ocrResult = await ocrService.extractText(image);
      
      if (!ocrResult.text) {
        return res.status(400).json({
          success: false,
          error: 'No text found in the image',
        });
      }

      // Step 2: Fact check the extracted text
      console.log('Step 2: Fact checking...');
      const factCheckResult = await factCheckService.checkFact(ocrResult.text);

      // Step 3: Translate if needed (language !== 'en')
      let translatedExplanation = factCheckResult.explanation;
      if (language !== 'en') {
        console.log(`Step 3: Translating to ${language}...`);
        const translation = await translationService.translate(
          factCheckResult.explanation,
          language,
          'en'
        );
        translatedExplanation = translation.translatedText;
      }

      // Step 4: Generate audio if requested
      let audioData = null;
      if (generateAudio) {
        console.log('Step 4: Generating audio...');
        const audioResult = await speechService.textToSpeech(
          translatedExplanation,
          language
        );
        audioData = audioResult.audioBuffer.toString('base64');
      }

      // Save to database
      const savedFactCheck = await prisma.factCheck.create({
        data: {
          originalText: ocrResult.text,
          isFactual: factCheckResult.isFactual,
          verificationStatus: factCheckResult.verificationStatus,
          explanation: factCheckResult.explanation,
          sources: factCheckResult.sources,
          confidence: factCheckResult.confidence,
          language,
        },
      });

      res.json({
        success: true,
        data: {
          id: savedFactCheck.id,
          extractedText: ocrResult.text,
          ocrConfidence: ocrResult.confidence,
          factCheck: {
            isFactual: factCheckResult.isFactual,
            status: factCheckResult.verificationStatus,
            explanation: translatedExplanation,
            sources: factCheckResult.sources,
            confidence: factCheckResult.confidence,
          },
          language,
          audio: audioData,
        },
      });
    } catch (error) {
      console.error('Fact Check from Screenshot Error:', error);
      res.status(500).json({
        success: false,
        error: 'Fact check failed',
        message: error.message,
      });
    }
  }

  /**
   * Fact check from direct text input
   */
  async checkFromText(req, res) {
    try {
      const { text, language = 'en', generateAudio = false } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Text is required',
        });
      }

      // Detect language if text is not in English
      let detectedLanguage = 'en';
      if (language === 'auto') {
        const detection = await translationService.detectLanguage(text);
        detectedLanguage = detection.language;
      }

      // Translate to English for fact checking if needed
      let textToCheck = text;
      if (detectedLanguage !== 'en') {
        const translation = await translationService.translate(text, 'en', detectedLanguage);
        textToCheck = translation.translatedText;
      }

      // Fact check
      const factCheckResult = await factCheckService.checkFact(textToCheck);

      // Translate result back if needed
      let translatedExplanation = factCheckResult.explanation;
      if (language !== 'en' && language !== 'auto') {
        const translation = await translationService.translate(
          factCheckResult.explanation,
          language,
          'en'
        );
        translatedExplanation = translation.translatedText;
      }

      // Generate audio if requested
      let audioData = null;
      if (generateAudio) {
        const audioResult = await speechService.textToSpeech(
          translatedExplanation,
          language
        );
        audioData = audioResult.audioBuffer.toString('base64');
      }

      // Save to database
      const savedFactCheck = await prisma.factCheck.create({
        data: {
          originalText: text,
          isFactual: factCheckResult.isFactual,
          verificationStatus: factCheckResult.verificationStatus,
          explanation: factCheckResult.explanation,
          sources: factCheckResult.sources,
          confidence: factCheckResult.confidence,
          language: detectedLanguage,
        },
      });

      res.json({
        success: true,
        data: {
          id: savedFactCheck.id,
          originalText: text,
          factCheck: {
            isFactual: factCheckResult.isFactual,
            status: factCheckResult.verificationStatus,
            explanation: translatedExplanation,
            sources: factCheckResult.sources,
            confidence: factCheckResult.confidence,
          },
          language: detectedLanguage,
          audio: audioData,
        },
      });
    } catch (error) {
      console.error('Fact Check from Text Error:', error);
      res.status(500).json({
        success: false,
        error: 'Fact check failed',
        message: error.message,
      });
    }
  }

  /**
   * Get fact check history
   */
  async getHistory(req, res) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where = {};
      if (status) where.verificationStatus = status;

      const [history, total] = await Promise.all([
        prisma.factCheck.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.factCheck.count({ where }),
      ]);

      res.json({
        success: true,
        data: history,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error('Get History Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch history',
      });
    }
  }

  /**
   * Get fact check by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const factCheck = await prisma.factCheck.findUnique({
        where: { id },
      });

      if (!factCheck) {
        return res.status(404).json({
          success: false,
          error: 'Fact check not found',
        });
      }

      res.json({
        success: true,
        data: factCheck,
      });
    } catch (error) {
      console.error('Get Fact Check Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch fact check',
      });
    }
  }

  /**
   * Get fact check statistics
   */
  async getStats(req, res) {
    try {
      const [total, trueCount, falseCount, partialCount, unverifiedCount] = await Promise.all([
        prisma.factCheck.count(),
        prisma.factCheck.count({ where: { verificationStatus: 'TRUE' } }),
        prisma.factCheck.count({ where: { verificationStatus: 'FALSE' } }),
        prisma.factCheck.count({ where: { verificationStatus: 'PARTIALLY_TRUE' } }),
        prisma.factCheck.count({ where: { verificationStatus: 'UNVERIFIED' } }),
      ]);

      res.json({
        success: true,
        data: {
          total,
          breakdown: {
            true: trueCount,
            false: falseCount,
            partiallyTrue: partialCount,
            unverified: unverifiedCount,
          },
        },
      });
    } catch (error) {
      console.error('Get Stats Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
      });
    }
  }
}

module.exports = new FactCheckController();
