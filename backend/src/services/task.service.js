const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');

function buildTaskFilter(user, query = {}) {
  const filter = {};

  if (user.role !== 'admin') {
    filter.owner = user._id;
  } else if (query.ownerId) {
    filter.owner = query.ownerId;
  }

  if (query.status) {
    filter.status = query.status;
  }

  return filter;
}

async function listTasks(user, query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = buildTaskFilter(user, query);

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}

async function getTaskById(user, taskId) {
  const task = await Task.findById(taskId).populate('owner', 'name email');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (user.role !== 'admin' && task.owner._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You can only access your own tasks');
  }

  return task;
}

async function createTask(user, data) {
  const task = await Task.create({
    title: data.title,
    description: data.description || '',
    status: data.status || 'pending',
    owner: user._id,
  });

  return task.populate('owner', 'name email');
}

async function updateTask(user, taskId, data) {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (user.role !== 'admin' && task.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You can only update your own tasks');
  }

  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.status !== undefined) task.status = data.status;

  await task.save();
  return task.populate('owner', 'name email');
}

async function deleteTask(user, taskId) {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (user.role !== 'admin' && task.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You can only delete your own tasks');
  }

  await task.deleteOne();
  return task;
}

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
