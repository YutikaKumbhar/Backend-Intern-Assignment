const { validateBody } = require('../middleware/validate');

const registerSchema = {
  name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 8, maxLength: 128 },
};

const loginSchema = {
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 8, maxLength: 128 },
};

module.exports = {
  validateRegister: validateBody(registerSchema),
  validateLogin: validateBody(loginSchema),
};
