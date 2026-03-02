/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code?.startsWith('P')) {
    return res.status(400).json({
      success: false,
      error: 'Database error',
      message: err.message,
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: err.message,
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
