/**
 * GAME CONFIGURATION
 *
 * Centralized config for prizes and probabilities.
 * Change values here to update across the entire app.
 *
 * NOTE: Server probabilities must also be updated in:
 * supabase/functions/spin/index.ts (lines ~32-35)
 */

// ===========================================
// PRIZE AMOUNTS
// ===========================================

export const PRIZES = {
  // Penny win reward (5 pennies in a row)
  PENNY_WIN_AMOUNT: 1,           // Amount in SOL
  PENNY_WIN_UNIT: 'SOL',         // Currency unit

  // Jackpot reward (5 pigs in a row)
  JACKPOT_PERCENTAGE: 10,        // Percentage of creator-fees wallet
};

// ===========================================
// WIN PROBABILITIES (Frontend DEV MODE only)
// For production, update supabase/functions/spin/index.ts
// ===========================================

export const DEV_PROBABILITIES = {
  JACKPOT: 0.05,    // 5% chance for jackpot (5 pigs)
  PENNY_WIN: 0.15,  // 15% chance for penny win (5 pennies)
  // Remaining % = loss
};

// ===========================================
// DISPLAY TEXT HELPERS
// ===========================================

export const getPennyWinText = () => {
  return `You win ${PRIZES.PENNY_WIN_AMOUNT} ${PRIZES.PENNY_WIN_UNIT}!`;
};

export const getJackpotText = () => {
  return `You win ${PRIZES.JACKPOT_PERCENTAGE}% of the creator-fees wallet!`;
};

// For Twitter sharing
export const getShareText = {
  penny: () => `I just won ${PRIZES.PENNY_WIN_AMOUNT} ${PRIZES.PENNY_WIN_UNIT} on @PennySOLL! 5 Pennies in a row! Try your luck:`,
  jackpot: () => `I just hit the JACKPOT on @PennySOLL! Won ${PRIZES.JACKPOT_PERCENTAGE}% of the creator-fees wallet! Try your luck:`,
};

// ===========================================
// GAME SYMBOLS
// Must match server's SYMBOLS array in spin/index.ts
// ===========================================

export const SYMBOLS = [
  { id: 'penny', src: '/imgs/penny.png', alt: 'Penny', weight: 5 },
  { id: 'pig', src: '/imgs/pig.png', alt: 'Pig', weight: 5 },
  { id: 's1', src: '/imgs/1.PNG', alt: 'Symbol 1', weight: 12 },
  { id: 's2', src: '/imgs/2.PNG', alt: 'Symbol 2', weight: 12 },
  { id: 's3', src: '/imgs/3.PNG', alt: 'Symbol 3', weight: 12 },
  { id: 's4', src: '/imgs/4.PNG', alt: 'Symbol 4', weight: 12 },
  { id: 's5', src: '/imgs/5.PNG', alt: 'Symbol 5', weight: 12 },
  { id: 's6', src: '/imgs/6.PNG', alt: 'Symbol 6', weight: 12 },
  { id: 's7', src: '/imgs/7.PNG', alt: 'Symbol 7', weight: 12 },
  { id: 's8', src: '/imgs/8.PNG', alt: 'Symbol 8', weight: 12 },
  { id: 's9', src: '/imgs/9.PNG', alt: 'Symbol 9', weight: 12 },
];

// Symbol IDs only (for API matching)
export const SYMBOL_IDS = SYMBOLS.map(s => s.id);
