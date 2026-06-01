const express = require('express');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API v1 is running' });
});

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);

module.exports = router;
