const Loan = require("../models/Loan");

// ✅ Create Loan
const createLoan = async (req, res) => {
  try {
    const { borrowerName, amount, interestRate, dueDate, notes } = req.body;
    if (!borrowerName || !amount || !dueDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const loan = await Loan.create({
      user: req.user ? req.user._id : null,
      borrowerName,
      amount,
      interestRate,
      dueDate,
      notes,
    });
    res.status(201).json({ success: true, loan });
  } catch (error) {
    console.error("createLoan error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get All Loans
const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user ? req.user._id : null }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, loans });
  } catch (error) {
    console.error("getLoans error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createLoan, getLoans };
