/**
 * Truth Lens Backend Server
 * Main server file with all route configurations
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, strictLimiter } = require('./middleware/rateLimiter');

// Import routes
const newsRoutes = require('./routes/newsRoutes');
const factCheckRoutes = require('./routes/factCheckRoutes');
const speechRoutes = require('./routes/speechRoutes');
const ragRoutes = require('./routes/ragRoutes');
const translationRoutes = require('./routes/translationRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' })); // For base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev')); // HTTP request logger
app.use(logger); // Custom logger

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Truth Lens Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ===== API Routes =====
app.use('/api/news', apiLimiter, newsRoutes);
app.use('/api/fact-check', strictLimiter, factCheckRoutes);
app.use('/api/speech', strictLimiter, speechRoutes);
app.use('/api/rag', apiLimiter, ragRoutes);
app.use('/api/translate', apiLimiter, translationRoutes);

// ===== Root Route =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Truth Lens API',
    version: '1.0.0',
    endpoints: {
      news: '/api/news',
      factCheck: '/api/fact-check',
      speech: '/api/speech',
      rag: '/api/rag',
      translate: '/api/translate',
    },
    documentation: 'See README.md for full API documentation',
  });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// ===== Error Handler =====
app.use(errorHandler);

// ===== Start Server =====
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     Truth Lens Backend Server         ║
╠════════════════════════════════════════╣
║  Port: ${PORT.toString().padEnd(31)} ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(22)} ║
║  Time: ${new Date().toLocaleTimeString().padEnd(31)} ║
╚════════════════════════════════════════╝

Available Services:
  📰 News API:           http://localhost:${PORT}/api/news
  ✅ Fact Check API:     http://localhost:${PORT}/api/fact-check
  🎤 Speech API:         http://localhost:${PORT}/api/speech
  🔍 RAG API:            http://localhost:${PORT}/api/rag
  🌐 Translation API:    http://localhost:${PORT}/api/translate

Health Check:          http://localhost:${PORT}/health
  `);
});

// ===== Graceful Shutdown =====
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
