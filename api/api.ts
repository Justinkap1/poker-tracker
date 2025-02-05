import { TimeFrame } from '@/common/enum'
import {
  PlayerCashDataProps,
  PlayerTournamentDataProps,
} from '@/components/shared/dashboard'
import { Stakes, GameTypes, Location } from '@/lib/interfaces'
import { createClient } from '@/utils/supabase/client'

export const queryEditsHelper = async (
  query: any,
  selectedStake?: string | null,
  selectedLocation?: string | null,
  selectedTime?: string | null,
  selectedGameType?: string | null
): Promise<any> => {
  if (selectedStake) {
    query = query.eq('stake', selectedStake)
  }
  if (selectedLocation) {
    query = query.eq('location', selectedLocation)
  }
  if (selectedGameType) {
    query = query.eq('game_type', selectedGameType)
  }
  if (selectedTime) {
    const dateTime = new Date()
    switch (selectedTime) {
      case TimeFrame.LastDay:
        dateTime.setDate(dateTime.getDate() - 1)
        break
      case TimeFrame.LastWeek:
        dateTime.setDate(dateTime.getDate() - 7)
        break
      case TimeFrame.LastMonth:
        dateTime.setDate(dateTime.getDate() - 30)
        break
      case TimeFrame.Last3Months:
        dateTime.setDate(dateTime.getDate() - 90)
        break
      case TimeFrame.Last6Months:
        dateTime.setDate(dateTime.getDate() - 180)
        break
      case TimeFrame.LastYear:
        dateTime.setDate(dateTime.getDate() - 365)
        break
      default:
        break
    }
    const isoString = dateTime.toISOString()
    query = query.gte('start_time', isoString)
  }

  return query
}

export const fetchBasePlayerCashData = async (
  userId: string,
  selectedGameType?: string,
  selectedStake?: string,
  selectedLocation?: string,
  selectedTime?: string
): Promise<PlayerCashDataProps> => {
  const supabase = createClient()

  let query = supabase
    .from('sessions')
    .select(
      `total_profit:net_result.sum(), total_time:time_played.sum(), session_count:id.count()`
    )
    .eq('user_id', userId)

  query = await queryEditsHelper(
    query,
    selectedStake,
    selectedLocation,
    selectedTime,
    selectedGameType
  )

  const { data: sessionData, error: sessionError } = await query

  if (sessionError) {
    console.error('Error fetching session data:', sessionError)
    return getDefaultPlayerCashData()
  }

  const { data: locationData, error: locationError } = await supabase
    .from('sessions')
    .select('location, count:location.count()')
    .eq('user_id', userId)
    .order('count', { ascending: false })
    .limit(1)

  const { data: stakeData, error: stakeError } = await supabase
    .from('sessions')
    .select('stake, count:stake.count()')
    .eq('user_id', userId)
    .order('count', { ascending: false })
    .limit(1)

  const { data: gameTypeData, error: gameTypeError } = await supabase
    .from('sessions')
    .select('game_type, count:game_type.count()')
    .eq('user_id', userId)
    .order('count', { ascending: false })
    .limit(1)

  if (locationError || stakeError || gameTypeError) {
    console.error(
      'Error fetching frequency data:',
      locationError,
      stakeError,
      gameTypeError
    )
    return getDefaultPlayerCashData()
  }

  const result = {
    totalProfit: sessionData?.[0]?.total_profit || 0,
    sessionCount: sessionData?.[0]?.session_count || 0,
    totalTime: sessionData?.[0]?.total_time || 0,
    freqLocation: locationData?.[0]?.location || '',
    freqStake: stakeData?.[0]?.stake || '',
    freqGameType: gameTypeData?.[0]?.game_type || '',
  }

  return result
}

const getDefaultPlayerCashData = (): PlayerCashDataProps => ({
  totalProfit: 0,
  sessionCount: 0,
  totalTime: 0,
  freqLocation: '',
  freqStake: '',
  freqGameType: '',
})

const getDefaultPlayerTournamentData = (): PlayerTournamentDataProps => ({
  totalProfit: 0,
  avgPlacement: 0,
  totalTime: 0,
  freqLocation: '',
  freqBuyin: 0,
  numTournaments: 0,
})

export const fetchBasePlayerTournamentData = async (
  userId: string,
  selectedGameType?: string,
  selectedStake?: string,
  selectedLocation?: string,
  selectedTime?: string
): Promise<PlayerTournamentDataProps> => {
  const supabase = createClient()

  let query = supabase
    .from('tournament_sessions')
    .select(
      `total_profit:net_result.sum(), total_time:days.sum(), session_count:id.count(), avg_placement:placement.avg()`
    )
    .eq('user_id', userId)

  query = await queryEditsHelper(
    query,
    selectedStake,
    selectedLocation,
    selectedTime,
    selectedGameType
  )

  const { data: sessionData, error: sessionError } = await query

  if (sessionError) {
    console.error('Error fetching session data:', sessionError)
    return getDefaultPlayerTournamentData()
  }

  const { data: locationData, error: locationError } = await supabase
    .from('tournament_sessions')
    .select('location, count:location.count()')
    .eq('user_id', userId)
    .order('count', { ascending: false })
    .limit(1)

  const { data: buyinData, error: buyinError } = await supabase
    .from('tournament_sessions')
    .select('buyin, count:buyin.count()')
    .eq('user_id', userId)
    .order('count', { ascending: false })
    .limit(1)

  if (locationError || buyinError) {
    console.error('Error fetching frequency data:', locationError, buyinError)
    return getDefaultPlayerTournamentData()
  }

  const result = {
    totalProfit: sessionData?.[0]?.total_profit || 0,
    numTournaments: sessionData?.[0]?.session_count || 0,
    totalTime: sessionData?.[0]?.total_time || 0,
    avgPlacement: sessionData?.[0].avg_placement || 0,
    freqLocation: locationData?.[0]?.location || '',
    freqBuyin: buyinData?.[0]?.buyin || '',
  }

  return result
}

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
