const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['given', 'taken'],
    required: true
  },
  personName: {
    type: String,
    required: [true, 'ব্যক্তির নাম আবশ্যক'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'পরিমাণ আবশ্যক'],
    min: [0, 'পরিমাণ ০ বা তার বেশি হতে হবে']
  },
  remainingAmount: {
    type: Number,
    required: true
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
  dueDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending'
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

loanSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Loan', loanSchema);
