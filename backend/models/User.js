const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'নাম আবশ্যক'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'ইমেইল আবশ্যক'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'সঠিক ইমেইল দিন']
  },
  password: {
    type: String,
    required: false,  // Not stored for Firebase users (handled by Firebase Auth)
    select: false,    // Never return password in queries (security)
    minlength: [6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে']
  },
  profilePicture: {
    type: String,
    default: ''
  },
  authProvider: {
    type: String,
    enum: ['firebase-email', 'firebase-google', 'firebase-github'],
    default: 'firebase-email'
  },
  firebaseUid: {
    type: String,
    sparse: true,
    unique: true
  },
  language: {
    type: String,
    enum: ['bn', 'en', 'ar'],
    default: 'bn'
  },
  currency: {
    type: String,
    default: 'BDT'
  },
  mobile: {
    type: String,
    trim: true,
    default: ''
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  subscriptionType: {
    type: String,
    enum: ['monthly', 'yearly', 'lifetime', 'none'],
    default: 'none'
  },
  subscriptionStart: {
    type: Date,
    default: null
  },
  subscriptionEnd: {
    type: Date,
    default: null
  },
  paymentHistory: [{
    amount: Number,
    currency: String,
    method: String,
    transactionId: String,
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    date: { type: Date, default: Date.now }
  }],
  isVerified: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving (শুধু local auth এর জন্য)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
