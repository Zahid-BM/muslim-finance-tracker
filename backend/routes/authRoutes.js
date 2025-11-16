const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/social-login', authController.socialLogin);
router.get('/profile/:firebaseUid', authController.getProfile);
router.put('/update-profile', authController.updateProfile);

module.exports = router;
