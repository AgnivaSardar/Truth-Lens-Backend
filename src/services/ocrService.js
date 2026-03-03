/**
 * OCR Service - Extract text from screenshots
 * Calls independently hosted OCR model API
 */

const axios = require('axios');
const FormData = require('form-data');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class OCRService {
  constructor() {
    this.baseUrl = process.env.OCR_MODEL_API_URL;
    this.apiKey = process.env.OCR_MODEL_API_KEY;
    this.timeout = Number(process.env.OCR_MODEL_API_TIMEOUT_MS || 30000);
    this.useLocalOCR = String(process.env.OCR_USE_LOCAL || '').toLowerCase() === 'true';
    this.localTimeout = Number(process.env.OCR_LOCAL_TIMEOUT_MS || 180000);
    this.localScriptPath = process.env.OCR_LOCAL_SCRIPT_PATH || path.resolve(__dirname, 'local_ocr_bridge.py');
    this.localEngine = process.env.OCR_ENGINE || 'auto';

    const venvPython = path.resolve(__dirname, '../../../imgToText/truth-lens-ocr/venv/Scripts/python.exe');
    this.localPython = process.env.OCR_LOCAL_PYTHON || (fs.existsSync(venvPython) ? venvPython : 'python');

    this.localWorker = null;
    this.localWorkerBuffer = '';
    this.localWorkerPending = new Map();
    this.localRequestId = 0;

    if (this.shouldUseLocal()) {
      this.startLocalWorker().catch((error) => {
        console.error('Failed to prestart local OCR worker:', error.message);
      });
    }
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
    if (this.shouldUseLocal()) {
      if (!fs.existsSync(this.localScriptPath)) {
        throw new Error(`Local OCR bridge not found at ${this.localScriptPath}`);
      }
      return;
    }

    if (!this.baseUrl) {
      throw new Error('OCR_MODEL_API_URL is not configured');
    }
  }

  shouldUseLocal() {
    return this.useLocalOCR || !this.baseUrl;
  }

  startLocalWorker() {
    if (this.localWorker && !this.localWorker.killed) {
      return Promise.resolve(this.localWorker);
    }

    return new Promise((resolve, reject) => {
      const child = spawn(this.localPython, [this.localScriptPath], {
        env: {
          ...process.env,
          OCR_ENGINE: this.localEngine,
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let settled = false;

      child.stdout.on('data', (chunk) => {
        this.localWorkerBuffer += chunk.toString('utf8');
        const lines = this.localWorkerBuffer.split(/\r?\n/);
        this.localWorkerBuffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          this.handleLocalWorkerLine(line);
        }
      });

      child.stderr.on('data', (chunk) => {
        const message = chunk.toString().trim();
        if (message) {
          console.error('Local OCR worker stderr:', message);
        }
      });

      child.on('error', (error) => {
        if (!settled) {
          settled = true;
          reject(new Error(`Failed to start local OCR process: ${error.message}`));
        }
      });

      child.on('close', () => {
        this.localWorker = null;
        for (const [, pending] of this.localWorkerPending.entries()) {
          clearTimeout(pending.timer);
          pending.reject(new Error('Local OCR worker process exited unexpectedly'));
        }
        this.localWorkerPending.clear();
      });

      this.localWorker = child;

      if (!settled) {
        settled = true;
        resolve(child);
      }
    });
  }

  handleLocalWorkerLine(line) {
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch (e) {
      console.error('Failed to parse OCR worker response:', line.substring(0, 200));
      return;
    }

    const requestId = Number(parsed.id);
    if (!Number.isFinite(requestId)) {
      return;
    }

    const pending = this.localWorkerPending.get(requestId);
    if (!pending) {
      return;
    }

    clearTimeout(pending.timer);
    this.localWorkerPending.delete(requestId);

    if (!parsed.ok) {
      const errorMsg = parsed.error || 'Local OCR failed';
      console.error('OCR worker error:', errorMsg);
      pending.reject(new Error(errorMsg));
      return;
    }

    pending.resolve({
      text: (parsed.text || '').trim(),
      confidence: Number(parsed.confidence ?? 0),
      blocks: parsed.blocks || [],
    });
  }

  runLocalOCR(imageBase64) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.startLocalWorker();
      } catch (error) {
        reject(error);
        return;
      }

      if (!this.localWorker || this.localWorker.killed) {
        reject(new Error('Local OCR worker is not available'));
        return;
      }

      const requestId = ++this.localRequestId;
      const timer = setTimeout(() => {
        this.localWorkerPending.delete(requestId);
        reject(new Error(`Local OCR timed out after ${Math.round(this.localTimeout / 1000)}s`));
      }, this.localTimeout);

      this.localWorkerPending.set(requestId, { resolve, reject, timer });

      const payload = JSON.stringify({ id: requestId, imageBase64 }) + '\n';
      this.localWorker.stdin.write(payload, (error) => {
        if (error) {
          clearTimeout(timer);
          this.localWorkerPending.delete(requestId);
          reject(new Error(`Failed to send request to local OCR worker: ${error.message}`));
        }
      });
    });
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

      if (this.shouldUseLocal()) {
        return await this.runLocalOCR(image.buffer.toString('base64'));
      }

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
