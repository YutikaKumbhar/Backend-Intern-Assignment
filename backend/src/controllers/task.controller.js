const taskService = require('../services/task.service');
const asyncHandler = require('../utils/asyncHandler');

const listTasks = asyncHandler(async (req, res) => {
  const result = await taskService.listTasks(req.user, req.query);
  res.json({ success: true, data: result });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.user, req.params.id);
  res.json({ success: true, data: { task } });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user, req.body);
  res.status(201).json({ success: true, data: { task } });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user, req.params.id, req.body);
  res.json({ success: true, data: { task } });
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user, req.params.id);
  res.json({ success: true, message: 'Task deleted' });
});

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
