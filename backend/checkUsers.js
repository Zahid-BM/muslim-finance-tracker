require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    
    const users = await User.find({});
    console.log('\n📊 Total Users:', users.length);
    console.log('\n👥 All Users:');
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Firebase UID: ${user.firebaseUid}`);
      console.log(`   Auth Provider: ${user.authProvider}`);
      console.log(`   Created: ${user.createdAt}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();
