#!/usr/bin/env node

// User Data Export Script
// Usage: node export-users.js

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🕌 Bismillahir Rahmanir Rahim');
console.log('📊 Starting User Data Export...\n');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const User = require('./models/User');
    
    // Get all users
    const users = await User.find({}).select('name email mobile isPhoneVerified subscriptionTier createdAt').lean();
    
    console.log(`👥 Found ${users.length} users\n`);
    
    // Create exports directory if not exists
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const csvFilename = path.join(exportDir, `users_${timestamp}.csv`);
    const jsonFilename = path.join(exportDir, `users_${timestamp}.json`);
    
    // CSV Export
    let csv = 'Name,Email,Mobile,Phone Verified,Subscription,Joined Date\n';
    users.forEach(user => {
      const name = (user.name || 'N/A').replace(/"/g, '""');
      const email = user.email.replace(/"/g, '""');
      const mobile = (user.mobile || 'N/A').replace(/"/g, '""');
      const verified = user.isPhoneVerified ? 'Yes' : 'No';
      const subscription = user.subscriptionTier || 'free';
      const joinedDate = new Date(user.createdAt).toLocaleDateString('en-GB');
      
      csv += `"${name}","${email}","${mobile}","${verified}","${subscription}","${joinedDate}"\n`;
    });
    
    fs.writeFileSync(csvFilename, csv);
    console.log(`✅ CSV exported: ${csvFilename}`);
    
    // JSON Export
    fs.writeFileSync(jsonFilename, JSON.stringify(users, null, 2));
    console.log(`✅ JSON exported: ${jsonFilename}`);
    
    // Summary Statistics
    console.log('\n📊 Statistics:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   With Mobile: ${users.filter(u => u.mobile).length}`);
    console.log(`   Phone Verified: ${users.filter(u => u.isPhoneVerified).length}`);
    console.log(`   Premium Users: ${users.filter(u => u.subscriptionTier === 'premium').length}`);
    
    // Country-wise breakdown
    const countries = {};
    users.forEach(user => {
      if (user.mobile) {
        const countryCode = user.mobile.substring(0, 4);
        countries[countryCode] = (countries[countryCode] || 0) + 1;
      }
    });
    
    console.log('\n🌍 Country Breakdown:');
    Object.entries(countries).forEach(([code, count]) => {
      const countryName = {
        '+880': '🇧🇩 Bangladesh',
        '+91': '🇮🇳 India',
        '+92': '🇵🇰 Pakistan',
        '+966': '🇸🇦 Saudi Arabia',
        '+971': '🇦🇪 UAE',
        '+1': '🇺🇸 USA',
        '+44': '🇬🇧 UK'
      }[code] || code;
      console.log(`   ${countryName}: ${count} users`);
    });
    
    // Recent users (last 10)
    console.log('\n📋 Recent Users (Last 10):');
    const recentUsers = users.slice(-10).reverse();
    recentUsers.forEach((user, i) => {
      console.log(`   ${i+1}. ${user.name} | ${user.email} | ${user.mobile || 'No mobile'}`);
    });
    
    console.log('\n✅ Alhamdulillah - Export Complete!');
    console.log(`�� Files saved in: ${exportDir}`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
