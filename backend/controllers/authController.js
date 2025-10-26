const User = require('../models/User');

// Register with Email/Password
exports.register = async (req, res) => {
  try {
    const { name, email, firebaseUid, authProvider } = req.body;

    // Check if user already exists by email OR firebaseUid
    let user = await User.findOne({ 
      $or: [{ email }, { firebaseUid }] 
    });

    if (user) {
      // Update firebaseUid if changed (important for old users)
      if (user.firebaseUid !== firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }
      
      return res.status(200).json({
        success: true,
        message: 'User already exists',
        user
      });
    }

    // Create new user
    user = await User.create({
      name,
      email,
      authProvider: authProvider || 'local',
      firebaseUid,
      isVerified: true
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Social Login (Google/GitHub)
exports.socialLogin = async (req, res) => {
  try {
    const { name, email, profilePicture, authProvider, firebaseUid } = req.body;

    // Check if user exists by email OR firebaseUid
    let user = await User.findOne({ 
      $or: [{ email }, { firebaseUid }] 
    });

    if (user) {
      // Update profile picture and firebaseUid if changed
      let updated = false;
      
      if (profilePicture && user.profilePicture !== profilePicture) {
        user.profilePicture = profilePicture;
        updated = true;
      }
      
      if (user.firebaseUid !== firebaseUid) {
        user.firebaseUid = firebaseUid;
        updated = true;
      }
      
      if (updated) {
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user
      });
    }

    // Create new user
    user = await User.create({
      name,
      email,
      profilePicture,
      authProvider,
      firebaseUid,
      isVerified: true
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};
