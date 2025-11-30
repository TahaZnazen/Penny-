// Supabase Edge Function: /spin
// Handles game code validation and spin result calculation
// Deploy: supabase functions deploy spin
//
// NOTE: IDE errors are expected - this runs in Deno (Supabase Edge Runtime)
// The code works correctly when deployed to Supabase

// @ts-ignore Deno import
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore Deno import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Deno global is available in Supabase Edge Functions runtime
declare const Deno: {
  env: { get(key: string): string | undefined }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Your actual symbols (must match frontend)
const SYMBOLS = ['penny', 'pig', 'ass', 'cool', 'pepe', 'spit', 'trump', 'viking', 'cill']
const NUM_REELS = 5

// Winning symbol indices (IMPORTANT: these determine what symbols show for wins)
const PENNY_INDEX = 0  // 'penny' at index 0 - for penny win (5 pennies)
const PIG_INDEX = 1    // 'pig' at index 1 - for jackpot (5 pigs)

// Win probabilities (adjust as needed)
// For testing: 33% jackpot, 33% penny, 33% lose
// For production: use 0.01 and 0.11
const JACKPOT_PROBABILITY = 0.33  // 0-33% = Jackpot
const PENNY_WIN_PROBABILITY = 0.66 // 33-66% = Penny (must be JACKPOT + desired penny %)

// Auto-reset configuration
const RESET_CYCLE_HOURS = 5        // Reset every 5 hours
const JACKPOTS_PER_CYCLE = 2       // 2 jackpots available per cycle
const PENNY_WINS_PER_CYCLE = 3     // 3 penny wins available per cycle

serve(async (req:any) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request
    const { gameCode, action } = await req.json()

    if (!gameCode) {
      return new Response(
        JSON.stringify({ error: 'Game code required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ==========================
    // ACTION: VALIDATE
    // ==========================
    if (action === 'validate') {
      const { data: session, error } = await supabase
        .from('game_sessions')
        .select('id, status, expires_at, user_id')
        .eq('game_code', gameCode.toUpperCase())
        .single()

      if (error || !session) {
        return new Response(
          JSON.stringify({ valid: false, error: 'Invalid game code' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Once spinning starts, code cannot be reused (prevents reload abuse)
      if (session.status !== 'pending') {
        return new Response(
          JSON.stringify({ valid: false, error: 'Game code already used' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const expiresAt = new Date(session.expires_at)
      if (new Date() > expiresAt) {
        // Mark as expired
        await supabase
          .from('game_sessions')
          .update({ status: 'expired' })
          .eq('id', session.id)

        return new Response(
          JSON.stringify({ valid: false, error: 'Game code expired' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ valid: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ==========================
    // ACTION: START SPIN
    // ==========================
    if (action === 'start') {
      // Get session and mark as spinning
      const { data: session, error } = await supabase
        .from('game_sessions')
        .update({ status: 'spinning', used_at: new Date().toISOString() })
        .eq('game_code', gameCode.toUpperCase())
        .eq('status', 'pending')
        .select('id, user_id')
        .single()

      if (error || !session) {
        return new Response(
          JSON.stringify({ error: 'Failed to start spin - code may be invalid or already used' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, sessionId: session.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ==========================
    // ACTION: COMPLETE SPIN
    // ==========================
    if (action === 'complete') {
      // Get session
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .select('*, users(*)')
        .eq('game_code', gameCode.toUpperCase())
        .eq('status', 'spinning')
        .single()

      if (sessionError || !session) {
        return new Response(
          JSON.stringify({ error: 'No active spin found for this code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get global state
      let { data: globalState } = await supabase
        .from('global_state')
        .select('*')
        .eq('id', 1)
        .single()

      // If no global state exists, create default one
      if (!globalState) {
        const { data: newState } = await supabase
          .from('global_state')
          .upsert({
            id: 1,
            jackpots_remaining: JACKPOTS_PER_CYCLE,
            penny_wins_remaining: PENNY_WINS_PER_CYCLE,
            last_reset_at: new Date().toISOString(),
            total_spins_this_cycle: 0,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()
        globalState = newState
      }

      // ========== AUTO-RESET CHECK ==========
      // Check if 5 hours have passed since last reset
      const now = new Date()
      const lastReset = globalState?.last_reset_at ? new Date(globalState.last_reset_at) : new Date(0)
      const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)

      if (hoursSinceReset >= RESET_CYCLE_HOURS) {
        // Reset prizes for new cycle
        const { data: resetState } = await supabase
          .from('global_state')
          .update({
            jackpots_remaining: JACKPOTS_PER_CYCLE,
            penny_wins_remaining: PENNY_WINS_PER_CYCLE,
            last_reset_at: now.toISOString(),
            total_spins_this_cycle: 0,
            updated_at: now.toISOString()
          })
          .eq('id', 1)
          .select()
          .single()

        if (resetState) {
          globalState = resetState
          console.log('Prizes reset for new cycle:', globalState)
        }
      }
      // ========================================

      // Calculate result
      const random = Math.random()
      let result: 'won_jackpot' | 'won_penny' | 'lost'
      let reels: number[] = []
      const numSymbols = SYMBOLS.length // 9 symbols

      // Check for jackpot (all 5 PIGS)
      if (random < JACKPOT_PROBABILITY && globalState?.jackpots_remaining > 0) {
        result = 'won_jackpot'
        reels = Array(NUM_REELS).fill(PIG_INDEX) // [pig, pig, pig, pig, pig] 🐷🐷🐷🐷🐷

        // Decrement jackpots remaining
        await supabase
          .from('global_state')
          .update({
            jackpots_remaining: globalState.jackpots_remaining - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', 1)
      }
      // Check for penny win (all 5 PENNIES)
      else if (random < PENNY_WIN_PROBABILITY && globalState?.penny_wins_remaining > 0) {
        result = 'won_penny'
        reels = Array(NUM_REELS).fill(PENNY_INDEX) // [penny, penny, penny, penny, penny] 💰💰💰💰💰

        // Decrement penny wins
        await supabase
          .from('global_state')
          .update({
            penny_wins_remaining: globalState.penny_wins_remaining - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', 1)
      }
      // Lose
      else {
        result = 'lost'
        // Generate random non-winning reels (not all same)
        do {
          reels = Array(NUM_REELS).fill(0).map(() => Math.floor(Math.random() * numSymbols))
        } while (reels.every(r => r === reels[0])) // Ensure not all same
      }

      // Update session with result
      const spinResult = {
        status: result,
        reels,
        timestamp: new Date().toISOString()
      }

      await supabase
        .from('game_sessions')
        .update({
          status: result,
          result_at: new Date().toISOString(),
          spin_result: spinResult
        })
        .eq('id', session.id)

      // Update user stats
      if (session.users) {
        const updates: Record<string, any> = {
          last_spin_at: new Date().toISOString(),
          total_spins: (session.users.total_spins || 0) + 1
        }

        if (result === 'won_penny') {
          updates.total_wins = (session.users.total_wins || 0) + 1
          updates.total_penny_wins = (session.users.total_penny_wins || 0) + 1
        } else if (result === 'won_jackpot') {
          updates.total_wins = (session.users.total_wins || 0) + 1
          updates.total_jackpots = (session.users.total_jackpots || 0) + 1
        }

        await supabase
          .from('users')
          .update(updates)
          .eq('id', session.users.id)

        // Record win in history
        if (result !== 'lost') {
          await supabase
            .from('win_history')
            .insert({
              user_id: session.users.id,
              game_session_id: session.id,
              win_type: result === 'won_jackpot' ? 'jackpot' : 'penny',
              wallet_address: session.users.wallet_address,
              telegram_id: session.users.telegram_id,
              telegram_username: session.users.telegram_username
            })
        }
      }

      // Increment global spin count
      await supabase
        .from('global_state')
        .update({
          total_spins_this_cycle: (globalState?.total_spins_this_cycle || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1)

      return new Response(
        JSON.stringify({
          result,
          reels,
          // Map reel numbers to symbol names for frontend
          symbols: reels.map(r => SYMBOLS[r])
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Unknown action
    return new Response(
      JSON.stringify({ error: 'Invalid action. Use: validate, start, complete' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
