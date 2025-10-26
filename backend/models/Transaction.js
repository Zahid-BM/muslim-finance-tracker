const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'লেনদেনের ধরন আবশ্যক']
  },
  category: {
    type: String,
    required: [true, 'ক্যাটাগরি আবশ্যক'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'পরিমাণ আবশ্যক'],
    min: [0, 'পরিমাণ ০ বা তার বেশি হতে হবে']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'mobile_banking', 'card', 'other'],
    default: 'cash'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
