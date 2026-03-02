/**
 * OCR Service - Extract text from screenshots
 * Calls independently hosted OCR model API
 */

const axios = require('axios');
const FormData = require('form-data');

class OCRService {
  constructor() {
    this.baseUrl = process.env.OCR_MODEL_API_URL;
    this.apiKey = process.env.OCR_MODEL_API_KEY;
    this.timeout = Number(process.env.OCR_MODEL_API_TIMEOUT_MS || 30000);
  }

  buildHeaders(formData) {
    const headers = formData ? formData.getHeaders() : {};

    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  normalizeImage(imageData) {
    if (Buffer.isBuffer(imageData)) {
      return {
        buffer: imageData,
        filename: 'image.png',
        contentType: 'image/png',
      };
    }

    if (typeof imageData === 'string') {
      const dataUriMatch = imageData.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);

      if (dataUriMatch) {
        const [, contentType, base64Data] = dataUriMatch;
        const extension = contentType.split('/')[1] || 'png';
        return {
          buffer: Buffer.from(base64Data, 'base64'),
          filename: `image.${extension}`,
          contentType,
        };
      }

      return {
        buffer: Buffer.from(imageData, 'base64'),
        filename: 'image.png',
        contentType: 'image/png',
      };
    }

    throw new Error('Invalid image format. Expected base64 string or Buffer.');
  }

  ensureConfigured() {
    if (!this.baseUrl) {
      throw new Error('OCR_MODEL_API_URL is not configured');
    }
  }

  getExtractTextUrl() {
    const trimmedBaseUrl = this.baseUrl.replace(/\/+$/, '');
    if (/\/extract-text$/i.test(trimmedBaseUrl)) {
      return trimmedBaseUrl;
    }
    return `${trimmedBaseUrl}/extract-text`;
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
      const formData = new FormData();

      formData.append('file', image.buffer, {
        filename: image.filename,
        contentType: image.contentType,
      });

      if (language) {
        formData.append('language', language);
      }

      const response = await axios.post(
        this.getExtractTextUrl(),
        formData,
        {
          headers: this.buildHeaders(formData),
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
