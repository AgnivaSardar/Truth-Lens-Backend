/**
 * Fact Checking Service
 * Calls independently hosted Fact Check model API
 */

const axios = require('axios');

class FactCheckService {
  constructor() {
    this.baseUrl = process.env.FACT_CHECK_MODEL_API_URL;
    this.apiKey = process.env.FACT_CHECK_MODEL_API_KEY;
    this.timeout = Number(process.env.FACT_CHECK_MODEL_API_TIMEOUT_MS || 30000);
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
      throw new Error('FACT_CHECK_MODEL_API_URL is not configured');
    }
  }

  /**
   * Check if a statement is factual using AI
   * @param {string} text - Text to fact-check
   * @returns {Promise<{isFactual: boolean, status: string, explanation: string, sources: array, confidence: number}>}
   */
  async checkFact(text) {
    try {
      this.ensureConfigured();
      const response = await axios.post(
        `${this.baseUrl}/check`,
        { text },
        {
          headers: this.buildHeaders(),
          timeout: this.timeout,
        }
      );

      const payload = response.data?.data || response.data || {};

      return {
        isFactual: Boolean(payload.isFactual),
        verificationStatus: payload.verificationStatus || 'UNVERIFIED',
        explanation: payload.explanation || 'No explanation provided.',
        sources: Array.isArray(payload.sources) ? payload.sources : [],
        confidence: Number(payload.confidence ?? 0),
      };
    } catch (error) {
      console.error('Fact Check Error:', error);
      throw new Error(`Fact checking failed: ${error.message}`);
    }
  }
}

module.exports = new FactCheckService();
