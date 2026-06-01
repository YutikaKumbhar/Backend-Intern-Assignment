const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

function signToken(userId) {
  return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: jwtExpiresIn });
}

async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);

  return { user: user.toSafeJSON(), token };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user._id);
  return { user: user.toSafeJSON(), token };
}

async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user.toSafeJSON();
}

module.exports = { register, login, getProfile, signToken };
