const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, transactionController.addTransaction);
router.get('/:firebaseUid', authenticate, transactionController.getTransactions);
router.get('/stats/:firebaseUid', authenticate, transactionController.getTransactionStats);
router.delete('/:id', authenticate, transactionController.deleteTransaction);

module.exports = router;
