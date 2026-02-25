const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const protect = require('../middleware/auth');
const {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
} = require('../middleware/validate');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validateUpdateProfile, updateProfile);

module.exports = router;
