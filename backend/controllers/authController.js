const User = require('../models/User');

// Register with Email/Password
exports.register = async (req, res) => {
  try {
    const { name, email, firebaseUid, authProvider, isEmailVerified } = req.body;

    // Validation
    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'Firebase UID is required'
      });
    }

    // Check if user already exists by firebaseUid (primary) or email (secondary)
    let user = await User.findOne({ 
      $or: [{ firebaseUid }, { email }] 
    });

    if (user) {
      // Update user info if changed
      let updated = false;
      
      if (user.firebaseUid !== firebaseUid) {
        user.firebaseUid = firebaseUid;
        updated = true;
      }
      
      if (user.name !== name) {
        user.name = name;
        updated = true;
      }
      
      if (isEmailVerified !== undefined && user.isEmailVerified !== isEmailVerified) {
        user.isEmailVerified = isEmailVerified;
        updated = true;
      }
      
      if (updated) {
        await user.save();
      }
      
      return res.status(200).json({
        success: true,
        message: 'User synced successfully',
        user
      });
    }

    // Create new user (NO password field - Firebase handles auth)
    user = await User.create({
      name,
      email,
      authProvider: authProvider || 'firebase-email',
      firebaseUid,
      isVerified: true,
      isEmailVerified: isEmailVerified || false
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
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

    // Create new user (NO password - Firebase handles auth)
    user = await User.create({
      name,
      email,
      profilePicture,
      authProvider: authProvider || 'firebase-google',
      firebaseUid,
      isVerified: true,
      isEmailVerified: true  // Google accounts are pre-verified
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


// Update User Profile (Mobile Number)
exports.updateProfile = async (req, res) => {
  try {
    const { firebaseUid, mobile, name } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'Firebase UID is required'
      });
    }

    // Find user
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (mobile) user.mobile = mobile;
    if (name) user.name = name;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};
