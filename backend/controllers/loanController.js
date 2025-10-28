const Loan = require('../models/Loan');
const User = require('../models/User');

exports.addLoan = async (req, res) => {
  try {
    const { type, personName, amount, description, date, dueDate, phoneNumber, notes, firebaseUid } = req.body;
    
    if (!type || !personName || !amount || !firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'সকল আবশ্যক তথ্য দিন'
      });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const loan = await Loan.create({
      user: user._id,
      type,
      personName,
      amount: parseFloat(amount),
      remainingAmount: parseFloat(amount),
      description,
      date: date || new Date(),
      dueDate: dueDate || null,
      phoneNumber,
      notes
    });

    res.status(201).json({
      success: true,
      message: type === 'given' ? 'দেওয়া ঋণ যোগ করা হয়েছে' : 'নেওয়া ঋণ যোগ করা হয়েছে',
      loan
    });
  } catch (error) {
    console.error('Add loan error:', error);
    res.status(500).json({
      success: false,
      message: 'ঋণ যোগ করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

exports.getLoans = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { type, status } = req.query;
    
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let query = { user: user._id };
    
    if (type) query.type = type;
    if (status) query.status = status;

    const loans = await Loan.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({
      success: false,
      message: 'ঋণ লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

exports.getLoanStats = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const totalGiven = await Loan.aggregate([
      { $match: { user: user._id, type: 'given' } },
      { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
    ]);

    const totalTaken = await Loan.aggregate([
      { $match: { user: user._id, type: 'taken' } },
      { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalGiven: totalGiven[0]?.total || 0,
        totalTaken: totalTaken[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get loan stats error:', error);
    res.status(500).json({
      success: false,
      message: 'পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { firebaseUid } = req.body;
    
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const loan = await Loan.findOneAndDelete({
      _id: id,
      user: user._id
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'ঋণ পাওয়া যায়নি'
      });
    }

    res.status(200).json({
      success: true,
      message: 'ঋণ মুছে ফেলা হয়েছে'
    });
  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({
      success: false,
      message: 'ঋণ মুছতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};
