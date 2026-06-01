const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../models/User');

const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();
  res.json({ success: true, data: { users } });
});

const updateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!role || !ROLES.includes(role)) {
    throw new ApiError(400, `role must be one of: ${ROLES.join(', ')}`);
  }

  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'Cannot change your own role');
  }

  const user = await userService.updateUserRole(req.params.id, role);
  res.json({ success: true, data: { user } });
});

const toggleActive = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive must be a boolean');
  }

  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'Cannot deactivate your own account');
  }

  const user = await userService.setUserActive(req.params.id, isActive);
  res.json({ success: true, data: { user } });
});

module.exports = { listUsers, updateRole, toggleActive };
