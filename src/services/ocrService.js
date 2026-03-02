/**
 * OCR Service - Extract text from screenshots
 * Calls independently hosted OCR model API
 */

const axios = require('axios');

class OCRService {
  constructor() {
    this.baseUrl = process.env.OCR_MODEL_API_URL;
    this.apiKey = process.env.OCR_MODEL_API_KEY;
    this.timeout = Number(process.env.OCR_MODEL_API_TIMEOUT_MS || 30000);
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

  normalizeImage(imageData) {
    if (Buffer.isBuffer(imageData)) {
      return imageData.toString('base64');
    }

    if (typeof imageData === 'string') {
      return imageData.replace(/^data:image\/\w+;base64,/, '');
    }

    throw new Error('Invalid image format. Expected base64 string or Buffer.');
  }

  ensureConfigured() {
    if (!this.baseUrl) {
      throw new Error('OCR_MODEL_API_URL is not configured');
    }
  }

  /**
   * Extract text from image buffer or base64 string
   * @param {Buffer|string} imageData - Image data (buffer or base64)
   * @returns {Promise<{text: string, confidence: number}>}
   */
  async extractText(imageData) {
    return this.extractTextWithLanguage(imageData, 'eng');
  }

  /**
   * Extract text with language support
   * @param {Buffer|string} imageData - Image data
   * @param {string} language - Language code (eng, spa, fra, etc.)
   * @returns {Promise<{text: string, confidence: number}>}
   */
  async extractTextWithLanguage(imageData, language = 'eng') {
    try {
      this.ensureConfigured();
      const image = this.normalizeImage(imageData);

      const response = await axios.post(
        `${this.baseUrl}/extract-text`,
        {
          image,
          language,
        },
        {
          headers: this.buildHeaders(),
          timeout: this.timeout,
        }
      );

      const payload = response.data?.data || response.data;

      return {
        text: (payload?.text || '').trim(),
        confidence: Number(payload?.confidence ?? 0),
        blocks: payload?.blocks || [],
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  }
}

module.exports = new OCRService();
