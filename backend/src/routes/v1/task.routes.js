const express = require('express');
const taskController = require('../../controllers/task.controller');
const { protect } = require('../../middleware/auth');
const { validateCreateTask, validateUpdateTask } = require('../../validators/task.validator');

const router = express.Router();

router.use(protect);

router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.post('/', validateCreateTask, taskController.createTask);
router.patch('/:id', validateUpdateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
