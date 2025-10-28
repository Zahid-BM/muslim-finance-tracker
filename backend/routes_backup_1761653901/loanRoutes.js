const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, loanController.addLoan);
router.get('/:firebaseUid', authenticate, loanController.getLoans);
router.get('/stats/:firebaseUid', authenticate, loanController.getLoanStats);
router.delete('/:id', authenticate, loanController.deleteLoan);

module.exports = router;
