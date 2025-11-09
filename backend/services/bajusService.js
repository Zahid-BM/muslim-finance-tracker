const axios = require('axios');

/**
 * BAJUS Gold/Silver Price Service (Bangladesh)
 * Uses TRADITIONAL (সনাতন) prices - lowest grade
 * Source: https://www.bajus.org/gold-price
 */

// Current prices (Update from BAJUS website)
const FALLBACK_PRICES = {
  // Gold - Traditional (সনাতন) per gram
  goldTraditional: 11761, // ৳11,761/gram (Nov 8, 2024)
  
  // Silver - Traditional per gram
  // Check BAJUS: https://www.bajus.org/gold-price
  silverTraditional: 160, // Approximate ৳160/gram (verify from BAJUS)
  
  lastUpdate: '2024-11-08',
  source: 'BAJUS (Bangladesh Jewellers Association)'
};

// Constants
const VORI_TO_GRAM = 11.66;
const SELLING_PRICE_DEDUCTION = 0.20; // 20% deduction

/**
 * Get current gold/silver prices
 */
const getBAJUSPrices = async () => {
  try {
    // Try to fetch from BAJUS (if API available)
    // For now, return fallback prices
    
    return {
      success: true,
      prices: {
        goldPerGram: FALLBACK_PRICES.goldTraditional,
        silverPerGram: FALLBACK_PRICES.silverTraditional,
        goldPerVori: Math.round(FALLBACK_PRICES.goldTraditional * VORI_TO_GRAM),
        silverPerVori: Math.round(FALLBACK_PRICES.silverTraditional * VORI_TO_GRAM),
        // After 20% deduction (selling price)
        goldSellingPerGram: Math.round(FALLBACK_PRICES.goldTraditional * (1 - SELLING_PRICE_DEDUCTION)),
        silverSellingPerGram: Math.round(FALLBACK_PRICES.silverTraditional * (1 - SELLING_PRICE_DEDUCTION)),
      },
      source: FALLBACK_PRICES.source,
      lastUpdate: FALLBACK_PRICES.lastUpdate,
      message: 'প্রকৃত দাম জানতে BAJUS ওয়েবসাইট দেখুন'
    };
    
  } catch (error) {
    console.error('BAJUS fetch error:', error.message);
    return {
      success: true,
      prices: {
        goldPerGram: FALLBACK_PRICES.goldTraditional,
        silverPerGram: FALLBACK_PRICES.silverTraditional,
        goldPerVori: Math.round(FALLBACK_PRICES.goldTraditional * VORI_TO_GRAM),
        silverPerVori: Math.round(FALLBACK_PRICES.silverTraditional * VORI_TO_GRAM),
        goldSellingPerGram: Math.round(FALLBACK_PRICES.goldTraditional * (1 - SELLING_PRICE_DEDUCTION)),
        silverSellingPerGram: Math.round(FALLBACK_PRICES.silverTraditional * (1 - SELLING_PRICE_DEDUCTION)),
      },
      source: 'Fallback prices',
      lastUpdate: FALLBACK_PRICES.lastUpdate,
      message: 'Visit BAJUS.org for latest prices'
    };
  }
};

module.exports = {
  getBAJUSPrices,
  VORI_TO_GRAM,
  SELLING_PRICE_DEDUCTION
};
