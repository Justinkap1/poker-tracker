import {
  GameTypes,
  Stakes,
  Location,
  Session,
  TournamentSession,
} from '@/lib/interfaces'
import { createClient } from '@/utils/supabase/server'

export const getUserLocations = async (
  userId: string,
  isCash: boolean
): Promise<Location[]> => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('location')
      .eq('user_id', userId)
      .eq('is_cash', isCash)
    if (error) {
      console.error('Error fetching locations:', error.message)
      return []
    } else {
      return data
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

export const getUserStakes = async (
  userId: string,
  isCash: boolean
): Promise<Stakes[]> => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('stakes')
      .select('stake')
      .eq('user_id', userId)
      .eq('is_cash', isCash)
    if (error) {
      console.error('Error fetching stakes:', error.message)
      return []
    } else {
      return data
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

export const getUserGameTypes = async (
  userId: string,
  isCash: boolean
): Promise<GameTypes[]> => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('game_types')
      .select('game_type')
      .eq('user_id', userId)
      .eq('is_cash', isCash)
    if (error) {
      console.error('Error fetching game types:', error.message)
      return []
    } else {
      return data
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

export const getUserCashSessions = async (
  userId: string,
  sortBy: string = 'start_time',
  ascending: boolean = false
): Promise<Session[]> => {
  const supabase = await createClient()
  let query = supabase
    .from('sessions')
    .select(
      `game_type, stake, location, time_played, start_time, end_time, buyin, cashout, net_result, id`
    )
    .eq('user_id', userId)
    .order(sortBy, { ascending })

  const { data: sessionData, error: sessionError } = await query
  if (sessionError) {
    console.error('Error fetching session data:', sessionError)
    return []
  }

  return sessionData
}

export const getUserTournamentSessions = async (
  userId: string,
  sortBy: string = 'start_time',
  ascending: boolean = false
): Promise<TournamentSession[]> => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('tournament_sessions')
      .select(
        'game_type, days, location, placement, start_time, end_time, buyin, cashout, net_result, id'
      )
      .eq('user_id', userId)
      .order(sortBy, { ascending })
    if (error) {
      console.error('Error fetching sessions:', error.message)
    } else {
      return data
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
  return []
}

export const getUserCashSessionByID = async (
  userId: string,
  sessionId: string
): Promise<Session[]> => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(
        'game_type, stake, location, start_time, end_time, buyin, cashout, id'
      )
      .eq('user_id', userId)
      .eq('id', sessionId)
    if (error) {
      console.error('Error fetching session:', error.message)
    } else {
      return data
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
  return []
}

export const getUserTournamentSessionByID = async (
  userId: string,
  sessionId: string
): Promise<TournamentSession[]> => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('tournament_sessions')
      .select(
        'game_type, placement, days, location, start_time, end_time, buyin, cashout, id'
      )
      .eq('user_id', userId)
      .eq('id', sessionId)
    if (error) {
      console.error('Error fetching session:', error.message)
    } else {
      return data
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
  return []
}
