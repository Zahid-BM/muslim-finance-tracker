require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const fixOldUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    
    // Find users without firebaseUid
    const usersWithoutUid = await User.find({ 
      $or: [
        { firebaseUid: { $exists: false } },
        { firebaseUid: null },
        { firebaseUid: '' }
      ]
    });
    
    console.log(`\n🔍 Found ${usersWithoutUid.length} users without Firebase UID`);
    
    if (usersWithoutUid.length > 0) {
      console.log('\n❌ These users need manual fixing:');
      usersWithoutUid.forEach(user => {
        console.log(`   - ${user.email}`);
      });
      console.log('\n⚠️  These users need to login again with Google to fix their accounts.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixOldUsers();
