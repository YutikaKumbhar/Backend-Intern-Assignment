const User = require('../models/User');
const ApiError = require('../utils/ApiError');

async function listUsers() {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map((u) => u.toSafeJSON());
}

async function updateUserRole(userId, role) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.role = role;
  await user.save();
  return user.toSafeJSON();
}

async function setUserActive(userId, isActive) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isActive = isActive;
  await user.save();
  return user.toSafeJSON();
}

module.exports = { listUsers, updateUserRole, setUserActive };
