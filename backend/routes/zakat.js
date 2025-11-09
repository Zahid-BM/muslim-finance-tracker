const express = require('express');
const router = express.Router();
const { getBAJUSPrices } = require('../services/bajusService');
const { calculateZakat, calculateNisabThreshold } = require('../services/zakatService');

/**
 * GET /api/zakat/prices
 * Get current gold/silver prices
 */
router.get('/prices', async (req, res) => {
  try {
    const priceData = await getBAJUSPrices();
    res.json(priceData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prices',
      error: error.message
    });
  }
});

/**
 * POST /api/zakat/calculate
 * Calculate Zakat
 */
router.post('/calculate', async (req, res) => {
  try {
    const { assets, liabilities, goldSellingPrice, silverSellingPrice } = req.body;
    
    // Calculate nisab threshold
    const nisabData = calculateNisabThreshold(goldSellingPrice, silverSellingPrice);
    
    // Calculate zakat
    const result = calculateZakat(assets, liabilities, goldSellingPrice, silverSellingPrice);
    
    res.json({
      success: true,
      result,
      nisabData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Zakat calculation failed',
      error: error.message
    });
  }
});

module.exports = router;
