const express = require("express");
const { protect } = require("../middleware/auth");
const { createLoan, getLoans } = require("../controllers/loanController");

const router = express.Router();

// Loan routes
router.post("/", protect, createLoan);
router.get("/", protect, getLoans);

module.exports = router;
