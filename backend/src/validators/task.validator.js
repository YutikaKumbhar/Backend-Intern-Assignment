const { STATUSES } = require('../models/Task');
const { validateBody } = require('../middleware/validate');

const createTaskSchema = {
  title: { required: true, type: 'string', minLength: 1, maxLength: 200 },
  description: { required: false, type: 'string', maxLength: 2000 },
  status: { required: false, enum: STATUSES },
};

const updateTaskSchema = {
  title: { required: false, type: 'string', minLength: 1, maxLength: 200 },
  description: { required: false, type: 'string', maxLength: 2000 },
  status: { required: false, enum: STATUSES },
};

module.exports = {
  validateCreateTask: validateBody(createTaskSchema),
  validateUpdateTask: validateBody(updateTaskSchema),
};
