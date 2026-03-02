/**
 * Speech Service
 * Handles Text-to-Speech (TTS) and Speech-to-Text (STT)
 * Calls independently hosted Speech model API
 */

const axios = require('axios');

class SpeechService {
  constructor() {
    this.baseUrl = process.env.SPEECH_MODEL_API_URL;
    this.apiKey = process.env.SPEECH_MODEL_API_KEY;
    this.timeout = Number(process.env.SPEECH_MODEL_API_TIMEOUT_MS || 60000);
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
      throw new Error('SPEECH_MODEL_API_URL is not configured');
    }
  }

  /**
   * Convert text to speech
   * @param {string} text - Text to convert
   * @param {string} language - Language code
   * @param {string} voice - Voice ID (optional)
   * @returns {Promise<{audioBuffer: Buffer, format: string}>}
   */
  async textToSpeech(text, language = 'en', voice = 'default') {
    try {
      this.ensureConfigured();

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech`,
        {
          text,
          language,
          voice,
        },
        {
          headers: this.buildHeaders(),
          timeout: this.timeout,
        }
      );

      const payload = response.data?.data || response.data || {};
      if (!payload.audio) {
        throw new Error('Speech API did not return audio data');
      }

      return {
        audioBuffer: Buffer.from(payload.audio, 'base64'),
        format: payload.format || 'mp3',
      };
    } catch (error) {
      console.error('Text-to-Speech Error:', error);
      throw new Error(`Text-to-speech conversion failed: ${error.message}`);
    }
  }

  /**
   * Convert speech to text
   * @param {Buffer} audioBuffer - Audio file buffer
   * @param {string} language - Language code
   * @returns {Promise<{text: string, language: string, confidence: number}>}
   */
  async speechToText(audioBuffer, language = 'en') {
    try {
      this.ensureConfigured();
      const audio = Buffer.isBuffer(audioBuffer)
        ? audioBuffer.toString('base64')
        : String(audioBuffer || '');

      const response = await axios.post(
        `${this.baseUrl}/speech-to-text`,
        {
          audio,
          language,
        },
        {
          headers: this.buildHeaders(),
          timeout: this.timeout,
        }
      );

      const payload = response.data?.data || response.data || {};

      return {
        text: payload.text || '',
        language: payload.language || language,
        confidence: Number(payload.confidence ?? 0),
      };
    } catch (error) {
      console.error('Speech-to-Text Error:', error);
      throw new Error(`Speech-to-text conversion failed: ${error.message}`);
    }
  }
}

module.exports = new SpeechService();
