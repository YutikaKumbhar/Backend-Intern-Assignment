const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  res.json({ success: true, data: { user } });
});

module.exports = { register, login, getMe };
