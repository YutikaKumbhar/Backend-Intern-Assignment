const express = require('express');
const userController = require('../../controllers/user.controller');
const { protect } = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', userController.listUsers);
router.patch('/:id/role', userController.updateRole);
router.patch('/:id/active', userController.toggleActive);

module.exports = router;
