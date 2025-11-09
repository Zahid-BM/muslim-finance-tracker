/**
 * Zakat Calculation Service - Hanafi Madhab
 * Sources: Darul Uloom Deoband, Mufti Taqi Usmani, Al-Kauthar
 */

const VORI_TO_GRAM = 11.66;
const NISAB_GOLD_VORI = 7.5; // ৭.৫ ভরি
const NISAB_SILVER_VORI = 52.5; // ৫২.৫ ভরি
const ZAKAT_RATE = 0.025; // 2.5%

/**
 * Calculate total assets
 * Note: Removed savings certificates (interest-based)
 */
const calculateTotalAssets = (assets) => {
  const {
    cash = 0,
    bankBalance = 0,
    goldValue = 0, // Already selling price (after 20% deduction)
    silverValue = 0, // Already selling price (after 20% deduction)
    businessInventory = 0,
    investments = 0,
    investmentProperties = 0,
    other = 0
  } = assets;

  return cash + bankBalance + goldValue + silverValue + 
         businessInventory + investments + investmentProperties + other;
};

/**
 * Calculate deductible liabilities (Hanafi madhab)
 * Only NECESSARY debts, NOT development loans
 */
const calculateDeductibleLiabilities = (liabilities) => {
  const {
    necessaryLoans = 0, // Food, shelter, medical
    unpaidBills = 0,
    other = 0
  } = liabilities;

  // Development/business expansion loans NOT deductible
  return necessaryLoans + unpaidBills + other;
};

/**
 * Calculate Nisab threshold
 * Use SILVER nisab (recommended for general public)
 */
const calculateNisabThreshold = (goldSellingPrice, silverSellingPrice) => {
  const silverNisab = NISAB_SILVER_VORI * VORI_TO_GRAM * silverSellingPrice;
  const goldNisab = NISAB_GOLD_VORI * VORI_TO_GRAM * goldSellingPrice;
  
  return {
    silverNisab: Math.round(silverNisab),
    goldNisab: Math.round(goldNisab),
    recommended: Math.round(silverNisab), // Use silver (lower threshold)
    note: 'রুপার নিসাব সাধারণ মানুষের জন্য (হানাফী)'
  };
};

/**
 * Calculate Zakat
 */
const calculateZakat = (assets, liabilities, goldSellingPrice, silverSellingPrice) => {
  const totalAssets = calculateTotalAssets(assets);
  const deductibleLiabilities = calculateDeductibleLiabilities(liabilities);
  const zakatableAmount = totalAssets - deductibleLiabilities;
  
  const nisabData = calculateNisabThreshold(goldSellingPrice, silverSellingPrice);
  const nisabThreshold = nisabData.recommended;
  
  const isObligatory = zakatableAmount >= nisabThreshold;
  const zakatDue = isObligatory ? Math.round(zakatableAmount * ZAKAT_RATE) : 0;
  
  return {
    totalAssets: Math.round(totalAssets),
    deductibleLiabilities: Math.round(deductibleLiabilities),
    zakatableAmount: Math.round(zakatableAmount),
    nisabThreshold,
    isObligatory,
    zakatDue,
    nisabData
  };
};

module.exports = {
  calculateTotalAssets,
  calculateDeductibleLiabilities,
  calculateNisabThreshold,
  calculateZakat,
  VORI_TO_GRAM,
  NISAB_GOLD_VORI,
  NISAB_SILVER_VORI,
  ZAKAT_RATE
};
