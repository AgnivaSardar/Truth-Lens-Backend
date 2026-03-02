/**
 * Translation Service
 * Calls independently hosted Translation model API
 */

const axios = require('axios');

class TranslationService {
  constructor() {
    this.baseUrl = process.env.TRANSLATION_MODEL_API_URL;
    this.apiKey = process.env.TRANSLATION_MODEL_API_KEY;
    this.timeout = Number(process.env.TRANSLATION_MODEL_API_TIMEOUT_MS || 30000);
  }

  buildHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  ensureConfigured() {
    if (!this.baseUrl) {
      throw new Error('TRANSLATION_MODEL_API_URL is not configured');
    }
  }

  /**
   * Translate text to target language
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language code (e.g., 'es', 'fr', 'de')
   * @param {string} sourceLang - Source language code (default: 'en')
   * @returns {Promise<{translatedText: string, sourceLang: string, targetLang: string}>}
   */
  async translate(text, targetLang, sourceLang = 'auto') {
    try {
      this.ensureConfigured();

      const response = await axios.post(
        `${this.baseUrl}/translate`,
        {
          text,
          sourceLang,
          targetLang,
        },
        {
          headers: this.buildHeaders(),
          timeout: this.timeout,
        }
      );

      const payload = response.data?.data || response.data || {};

      return {
        translatedText: payload.translatedText || '',
        sourceLang: payload.sourceLang || sourceLang,
        targetLang: payload.targetLang || targetLang,
      };
    } catch (error) {
      console.error('Translation Error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  /**
   * Detect language of text
   * @param {string} text 
   * @returns {Promise<{language: string, confidence: number}>}
   */
  async detectLanguage(text) {
    try {
      this.ensureConfigured();
      const response = await axios.post(
        `${this.baseUrl}/detect-language`,
        { text },
        {
          headers: this.buildHeaders(),
          timeout: this.timeout,
        }
      );

      const payload = response.data?.data || response.data || {};

      return {
        language: payload.language || 'en',
        confidence: Number(payload.confidence ?? 0),
      };
    } catch (error) {
      console.error('Language Detection Error:', error);
      return {
        language: 'en',
        confidence: 0.1,
      };
    }
  }

  /**
   * Batch translate multiple texts
   * @param {string[]} texts 
   * @param {string} targetLang 
   * @param {string} sourceLang 
   * @returns {Promise<object[]>}
   */
  async batchTranslate(texts, targetLang, sourceLang = 'auto') {
    try {
      this.ensureConfigured();

      const response = await axios.post(
        `${this.baseUrl}/batch-translate`,
        {
          texts,
          sourceLang,
          targetLang,
        },
        {
          headers: this.buildHeaders(),
          timeout: this.timeout,
        }
      );

      const payload = response.data?.data || response.data;
      if (Array.isArray(payload)) {
        return payload;
      }

      const translations = await Promise.all(
        texts.map(text => this.translate(text, targetLang, sourceLang))
      );
      return translations;
    } catch (error) {
      console.error('Batch Translation Error:', error);
      throw error;
    }
  }
}

module.exports = new TranslationService();
