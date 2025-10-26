const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register with email/password
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/social-login
// @desc    Login with Google/GitHub
// @access  Public
router.post('/social-login', authController.socialLogin);

// @route   GET /api/auth/profile/:firebaseUid
// @desc    Get user profile
// @access  Public
router.get('/profile/:firebaseUid', authController.getProfile);

module.exports = router;
