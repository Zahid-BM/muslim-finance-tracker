const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/', transactionController.addTransaction);
router.get('/:firebaseUid', transactionController.getTransactions);
router.get('/stats/:firebaseUid', transactionController.getTransactionStats);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
