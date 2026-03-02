/**
 * Rate Limiter Middleware
 * Prevents API abuse
 */

const rateLimit = require('express-rate-limit');

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
  max: 10,
  message: {
    success: false,
    error: 'Too many requests for this endpoint, please try again later.',
  },
});

module.exports = {
  apiLimiter,
  strictLimiter,
};
