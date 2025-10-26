const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// @route   POST /api/transactions
// @desc    Add new transaction
router.post('/', transactionController.addTransaction);

// @route   GET /api/transactions/:firebaseUid
// @desc    Get all transactions for a user
router.get('/:firebaseUid', transactionController.getTransactions);

// @route   GET /api/transactions/stats/:firebaseUid
// @desc    Get transaction statistics
router.get('/stats/:firebaseUid', transactionController.getTransactionStats);

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
