const ApiError = require('../utils/ApiError');
const { nodeEnv } = require('../config/env');

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `${field} already exists`;
  }

  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  const response = {
    success: false,
    message,
    ...(details && { errors: details }),
    ...(nodeEnv === 'development' && statusCode === 500 && { stack: err.stack }),
  };

  if (nodeEnv !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json(response);
}

module.exports = { notFoundHandler, errorHandler };
