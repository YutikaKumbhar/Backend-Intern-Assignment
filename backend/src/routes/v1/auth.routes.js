const express = require('express');
const authController = require('../../controllers/auth.controller');
const { protect } = require('../../middleware/auth');
const { validateRegister, validateLogin } = require('../../validators/auth.validator');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
