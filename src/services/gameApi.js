/**
 * Game API Service
 *
 * Handles communication with Supabase for game code validation and spin logic.
 * In development mode, provides mock responses for testing.
 */

// Configuration - Replace with your Supabase details
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = SUPABASE_URL && SUPABASE_ANON_KEY;

// Development mode - uses mock responses
const DEV_MODE = !isSupabaseConfigured;

if (DEV_MODE) {
  console.log('[GameAPI] Running in DEV MODE - using mock responses');
  console.log('[GameAPI] To enable Supabase, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
}

/**
 * Call the spin Edge Function
 */
async function callSpinFunction(gameCode, action) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured');
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/spin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ gameCode, action }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Validate a game code
 * @param {string} gameCode - The game code to validate
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export async function validateGameCode(gameCode) {
  if (!gameCode || gameCode.trim().length === 0) {
    return { valid: false, error: 'Please enter a game code' };
  }

  // DEV MODE: Accept any code starting with "TEST" or "DEV"
  if (DEV_MODE) {
    const code = gameCode.toUpperCase().trim();
    if (code.startsWith('TEST') || code.startsWith('DEV') || code.length >= 4) {
      console.log('[GameAPI] DEV MODE: Code accepted:', code);
      return { valid: true };
    }
    return { valid: false, error: 'Invalid code (dev mode: use TEST or DEV prefix, or any 4+ char code)' };
  }

  try {
    const result = await callSpinFunction(gameCode, 'validate');
    return result;
  } catch (error) {
    console.error('[GameAPI] Validation error:', error);
    return { valid: false, error: error.message || 'Failed to validate code' };
  }
}

/**
 * Start a spin session
 * @param {string} gameCode - The validated game code
 * @returns {Promise<{success: boolean, sessionId?: string, error?: string}>}
 */
export async function startSpin(gameCode) {
  // DEV MODE: Always succeed
  if (DEV_MODE) {
    console.log('[GameAPI] DEV MODE: Starting spin for code:', gameCode);
    return { success: true, sessionId: 'dev-session-' + Date.now() };
  }

  try {
    const result = await callSpinFunction(gameCode, 'start');
    return result;
  } catch (error) {
    console.error('[GameAPI] Start spin error:', error);
    return { success: false, error: error.message || 'Failed to start spin' };
  }
}

/**
 * Complete a spin and get the result
 * @param {string} gameCode - The game code
 * @returns {Promise<{result: 'won_jackpot'|'won_penny'|'lost', reels: number[], symbols: string[], error?: string}>}
 */
export async function completeSpin(gameCode) {
  // Must match server's SYMBOLS array in spin/index.ts
  const SYMBOLS = ['penny', 'pig', 'ass', 'cool', 'pepe', 'spit', 'trump', 'viking', 'cill'];
  const NUM_REELS = 5;

  // DEV MODE: Random result with configurable odds
  if (DEV_MODE) {
    console.log('[GameAPI] DEV MODE: Completing spin for code:', gameCode);

    // Simulated probabilities
    const random = Math.random();
    let result;
    let reels;

    // 5% jackpot chance in dev mode (all 5 same)
    if (random < 0.05) {
      result = 'won_jackpot';
      const symbol = Math.floor(Math.random() * SYMBOLS.length);
      reels = Array(NUM_REELS).fill(symbol);
    }
    // 15% penny win chance in dev mode (4 out of 5 same)
    else if (random < 0.20) {
      result = 'won_penny';
      const symbol = Math.floor(Math.random() * SYMBOLS.length);
      const other = (symbol + 1) % SYMBOLS.length;
      reels = Array(NUM_REELS).fill(symbol);
      reels[Math.floor(Math.random() * NUM_REELS)] = other;
    }
    // 80% lose
    else {
      result = 'lost';
      do {
        reels = Array(NUM_REELS).fill(0).map(() => Math.floor(Math.random() * SYMBOLS.length));
      } while (reels.every(r => r === reels[0])); // Ensure not all same
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('[GameAPI] DEV MODE: Result:', result, 'Reels:', reels);

    return {
      result,
      reels,
      symbols: reels.map(r => SYMBOLS[r])
    };
  }

  try {
    const result = await callSpinFunction(gameCode, 'complete');
    return result;
  } catch (error) {
    console.error('[GameAPI] Complete spin error:', error);
    // Return a loss on error to not block the game
    return {
      result: 'lost',
      reels: [0, 1, 2, 3, 4],
      symbols: SYMBOLS.slice(0, NUM_REELS),
      error: error.message
    };
  }
}

/**
 * Get global game state (prize availability)
 * @returns {Promise<{jackpotAvailable: boolean, pennyWinsRemaining: number}>}
 */
export async function getGameState() {
  // DEV MODE: Always available
  if (DEV_MODE) {
    return {
      jackpotAvailable: true,
      pennyWinsRemaining: 2
    };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/global_state?id=eq.1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const [state] = await response.json();
    return {
      jackpotAvailable: state?.jackpot_available ?? true,
      pennyWinsRemaining: state?.penny_wins_remaining ?? 2
    };
  } catch (error) {
    console.error('[GameAPI] Get state error:', error);
    return {
      jackpotAvailable: true,
      pennyWinsRemaining: 2
    };
  }
}

// Export DEV_MODE flag for UI indication
export const isDevMode = DEV_MODE;
