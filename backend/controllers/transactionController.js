const Transaction = require('../models/Transaction');

// Add Transaction (আয় বা ব্যয়)
exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, date, paymentMethod, notes } = req.body;
    const { firebaseUid } = req.body;

    // Validation
    if (!type || !category || !amount) {
      return res.status(400).json({
        success: false,
        message: 'সকল আবশ্যক তথ্য দিন'
      });
    }

    // Get user from database
    const User = require('../models/User');
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: user._id,
      type,
      category,
      amount: parseFloat(amount),
      description,
      date: date || new Date(),
      paymentMethod: paymentMethod || 'cash',
      notes
    });

    res.status(201).json({
      success: true,
      message: type === 'income' ? 'আয় যোগ করা হয়েছে' : 'ব্যয় যোগ করা হয়েছে',
      transaction
    });
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'লেনদেন যোগ করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// Get All Transactions
exports.getTransactions = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { type, startDate, endDate, category } = req.query;

    // Get user
    const User = require('../models/User');
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build query
    let query = { user: user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get transactions
    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'লেনদেন লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// Get Transaction Stats (Dashboard এর জন্য)
exports.getTransactionStats = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    // Get user
    const User = require('../models/User');
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Total Income
    const totalIncome = await Transaction.aggregate([
      { $match: { user: user._id, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Total Expense
    const totalExpense = await Transaction.aggregate([
      { $match: { user: user._id, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Monthly Income
    const monthlyIncome = await Transaction.aggregate([
      { 
        $match: { 
          user: user._id, 
          type: 'income',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Monthly Expense
    const monthlyExpense = await Transaction.aggregate([
      { 
        $match: { 
          user: user._id, 
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalIncome: totalIncome[0]?.total || 0,
        totalExpense: totalExpense[0]?.total || 0,
        monthlyIncome: monthlyIncome[0]?.total || 0,
        monthlyExpense: monthlyExpense[0]?.total || 0,
        balance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0)
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { firebaseUid } = req.body;

    // Get user
    const User = require('../models/User');
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find and delete transaction
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'লেনদেন পাওয়া যায়নি'
      });
    }

    res.status(200).json({
      success: true,
      message: 'লেনদেন মুছে ফেলা হয়েছে'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'লেনদেন মুছতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};
