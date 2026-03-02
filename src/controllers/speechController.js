/**
 * Speech Controller
 * Handles text-to-speech and speech-to-text conversions
 */

const speechService = require('../services/speechService');

class SpeechController {
  /**
   * Convert text to speech
   */
  async textToSpeech(req, res) {
    try {
      const { text, language = 'en', voice = 'default' } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Text is required',
        });
      }

      const result = await speechService.textToSpeech(text, language, voice);

      // Send audio as base64
      res.json({
        success: true,
        data: {
          audio: result.audioBuffer.toString('base64'),
          format: result.format,
          language,
        },
      });
    } catch (error) {
      console.error('Text-to-Speech Error:', error);
      res.status(500).json({
        success: false,
        error: 'Text-to-speech conversion failed',
        message: error.message,
      });
    }
  }

  /**
   * Convert speech to text
   */
  async speechToText(req, res) {
    try {
      const { audio, language = 'en' } = req.body;

      if (!audio) {
        return res.status(400).json({
          success: false,
          error: 'Audio data is required',
        });
      }

      // Convert base64 to buffer
      const audioBuffer = Buffer.from(audio, 'base64');

      const result = await speechService.speechToText(audioBuffer, language);

      res.json({
        success: true,
        data: {
          text: result.text,
          language: result.language,
          confidence: result.confidence,
        },
      });
    } catch (error) {
      console.error('Speech-to-Text Error:', error);
      res.status(500).json({
        success: false,
        error: 'Speech-to-text conversion failed',
        message: error.message,
      });
    }
  }

  /**
   * Convert speech to text and then to another language (combined)
   */
  async speechToTextWithTranslation(req, res) {
    try {
      const { audio, sourceLang = 'en', targetLang = 'en' } = req.body;

      if (!audio) {
        return res.status(400).json({
          success: false,
          error: 'Audio data is required',
        });
      }

      const audioBuffer = Buffer.from(audio, 'base64');
      
      // Convert speech to text
      const sttResult = await speechService.speechToText(audioBuffer, sourceLang);

      // Translate if needed
      let translatedText = sttResult.text;
      if (targetLang !== sourceLang) {
        const translationService = require('../services/translationService');
        const translation = await translationService.translate(
          sttResult.text,
          targetLang,
          sourceLang
        );
        translatedText = translation.translatedText;
      }

      res.json({
        success: true,
        data: {
          originalText: sttResult.text,
          translatedText,
          sourceLang,
          targetLang,
          confidence: sttResult.confidence,
        },
      });
    } catch (error) {
      console.error('Speech-to-Text with Translation Error:', error);
      res.status(500).json({
        success: false,
        error: 'Operation failed',
        message: error.message,
      });
    }
  }
}

module.exports = new SpeechController();
