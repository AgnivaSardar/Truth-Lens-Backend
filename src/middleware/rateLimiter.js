/**
 * Rate Limiter Middleware
 * Prevents API abuse
 */

const rateLimit = require('express-rate-limit');

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

// General API rate limiter (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for expensive operations (10 requests per 15 minutes)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many requests for this endpoint, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Fact-check limiter (tuned separately because Result page auto-analyzes on open)
const factCheckLimiter = rateLimit({
  windowMs: toPositiveInt(process.env.FACT_CHECK_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  max: toPositiveInt(process.env.FACT_CHECK_RATE_LIMIT_MAX, 120),
  message: {
    success: false,
    error: 'Too many fact-check requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  strictLimiter,
  factCheckLimiter,
};
