/**
 * Translation Controller
 * Handles text translation between languages
 */

const translationService = require('../services/translationService');

class TranslationController {
  /**
   * Translate text
   */
  async translate(req, res) {
    try {
      const { text, targetLang, sourceLang = 'auto' } = req.body;

      if (!text || !targetLang) {
        return res.status(400).json({
          success: false,
          error: 'Text and target language are required',
        });
      }

      const result = await translationService.translate(text, targetLang, sourceLang);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Translation Error:', error);
      res.status(500).json({
        success: false,
        error: 'Translation failed',
        message: error.message,
      });
    }
  }

  /**
   * Detect language of text
   */
  async detectLanguage(req, res) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Text is required',
        });
      }

      const result = await translationService.detectLanguage(text);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Language Detection Error:', error);
      res.status(500).json({
        success: false,
        error: 'Language detection failed',
        message: error.message,
      });
    }
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(req, res) {
    try {
      const { texts, targetLang, sourceLang = 'auto' } = req.body;

      if (!texts || !Array.isArray(texts) || !targetLang) {
        return res.status(400).json({
          success: false,
          error: 'Texts array and target language are required',
        });
      }

      const results = await translationService.batchTranslate(texts, targetLang, sourceLang);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error('Batch Translation Error:', error);
      res.status(500).json({
        success: false,
        error: 'Batch translation failed',
        message: error.message,
      });
    }
  }
}

module.exports = new TranslationController();
