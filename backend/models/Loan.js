const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    borrowerName: { type: String, required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);
