/**
 * Zakat Calculation Service
 * Following Hanafi madhab principles
 */

// Constants for South Asia
const VORI_TO_GRAM = 11.66; // 1 bhori = 11.66 grams
const NISAB_GOLD_VORI = 7.5; // ৭.৫ ভরি
const NISAB_SILVER_VORI = 52.5; // ৫২.৫ ভরি
const NISAB_GOLD_GRAM = 7.5 * 11.66; // 87.45 grams
const NISAB_SILVER_GRAM = 52.5 * 11.66; // 612.15 grams

// International (alternative)
const NISAB_GOLD_GRAM_INTL = 87.48; // ~85g gold
const NISAB_SILVER_GRAM_INTL = 612.36; // ~595g silver

// Zakat rate
const ZAKAT_RATE = 0.025; // 2.5%

/**
 * Calculate total assets
 */
const calculateTotalAssets = (assets) => {
  const {
    cash = 0,
    bankBalance = 0,
    goldGram = 0,
    silverGram = 0,
    goldValue = 0,
    silverValue = 0,
    businessInventory = 0,
    investments = 0,
    properties = 0,
    savingsCertificates = 0,
    other = 0
  } = assets;

  return cash + bankBalance + goldValue + silverValue + 
         businessInventory + investments + properties + 
         savingsCertificates + other;
};

/**
 * Calculate total liabilities (deductible)
 */
const calculateTotalLiabilities = (liabilities) => {
  const {
    loans = 0,
    unpaidBills = 0,
    businessDebts = 0,
    other = 0
  } = liabilities;

  // Only debts payable within 1 year are deductible
  return loans + unpaidBills + businessDebts + other;
};

/**
 * Calculate Nisab threshold in BDT
 */
const calculateNisabThreshold = (goldPricePerBhori, silverPricePerBhori) => {
  // Use silver nisab (more common for general public)
  const silverNisab = NISAB_SILVER_VORI * silverPricePerBhori;
  
  // Also calculate gold nisab for reference
  const goldNisab = NISAB_GOLD_VORI * goldPricePerBhori;
  
  return {
    silverNisab,
    goldNisab,
    recommended: silverNisab, // Use silver for general people
    note: 'Silver nisab recommended for most people (Hanafi)'
  };
};

/**
 * Check if Zakat is obligatory
 */
const isZakatObligatory = (zakatableAmount, nisabThreshold) => {
  return zakatableAmount >= nisabThreshold;
};

/**
 * Calculate Zakat amount
 */
const calculateZakat = (assets, liabilities, nisabThreshold) => {
  const totalAssets = calculateTotalAssets(assets);
  const totalLiabilities = calculateTotalLiabilities(liabilities);
  const zakatableAmount = totalAssets - totalLiabilities;
  
  const isObligatory = isZakatObligatory(zakatableAmount, nisabThreshold);
  
  const zakatDue = isObligatory ? zakatableAmount * ZAKAT_RATE : 0;
  
  return {
    totalAssets,
    totalLiabilities,
    zakatableAmount,
    nisabThreshold,
    isObligatory,
    zakatDue,
    zakatRate: ZAKAT_RATE,
    calculations: {
      assets: totalAssets,
      minus: totalLiabilities,
      equals: zakatableAmount,
      nisab: nisabThreshold,
      zakat: zakatDue
    }
  };
};

/**
 * Convert gold grams to value
 */
const goldGramToValue = (grams, pricePerBhori) => {
  const bhori = grams / VORI_TO_GRAM;
  return bhori * pricePerBhori;
};

/**
 * Convert silver grams to value
 */
const silverGramToValue = (grams, pricePerBhori) => {
  const bhori = grams / VORI_TO_GRAM;
  return bhori * pricePerBhori;
};

module.exports = {
  VORI_TO_GRAM,
  NISAB_GOLD_VORI,
  NISAB_SILVER_VORI,
  NISAB_GOLD_GRAM,
  NISAB_SILVER_GRAM,
  ZAKAT_RATE,
  calculateTotalAssets,
  calculateTotalLiabilities,
  calculateNisabThreshold,
  isZakatObligatory,
  calculateZakat,
  goldGramToValue,
  silverGramToValue
};
