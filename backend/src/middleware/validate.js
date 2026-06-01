const validator = require('validator');
const ApiError = require('../utils/ApiError');

function sanitizeString(value, maxLength) {
  if (value === undefined || value === null) {
    return value;
  }
  let str = String(value).trim();
  if (maxLength) {
    str = str.slice(0, maxLength);
  }
  return str;
}

function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    const body = req.body || {};

    for (const [field, rules] of Object.entries(schema)) {
      const raw = body[field];

      if (rules.required && (raw === undefined || raw === null || raw === '')) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }

      if (raw === undefined || raw === null || raw === '') {
        continue;
      }

      if (rules.type === 'email' && !validator.isEmail(String(raw))) {
        errors.push({ field, message: 'Invalid email format' });
      }

      if (rules.type === 'string') {
        const len = String(raw).length;
        if (rules.minLength && len < rules.minLength) {
          errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
        }
        if (rules.maxLength && len > rules.maxLength) {
          errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters` });
        }
      }

      if (rules.enum && !rules.enum.includes(raw)) {
        errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}` });
      }
    }

    if (errors.length) {
      return next(new ApiError(400, 'Validation failed', errors));
    }

    const sanitized = {};
    for (const [field, rules] of Object.entries(schema)) {
      const raw = body[field];
      if (raw === undefined || raw === null) {
        continue;
      }
      if (rules.type === 'email') {
        sanitized[field] = validator.normalizeEmail(String(raw).trim().toLowerCase());
      } else if (rules.type === 'string') {
        sanitized[field] = sanitizeString(raw, rules.maxLength);
      } else {
        sanitized[field] = raw;
      }
    }

    req.body = { ...body, ...sanitized };
    next();
  };
}

module.exports = { validateBody, sanitizeString };
