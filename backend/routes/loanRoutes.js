const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/', loanController.addLoan);
router.get('/:firebaseUid', loanController.getLoans);
router.get('/stats/:firebaseUid', loanController.getLoanStats);
router.delete('/:id', loanController.deleteLoan);

module.exports = router;
