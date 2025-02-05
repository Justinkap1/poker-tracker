'use client'

import {
  getUserGameTypes,
  getUserLocations,
  getUserStakes,
} from '@/api/api_server'
import Dashboard from '@/components/shared/dashboard'
import { GameTypes, Location, Stakes } from '@/lib/interfaces'
import { useEffect, useState } from 'react'

interface DashboardMainProps {
  user: string
}

const DashboardMain: React.FC<DashboardMainProps> = ({ user }) => {
  const times = [
    'Last Day',
    'Last Week',
    'Last Month',
    'Last 3 Months',
    'Last 6 Months',
    'Last Year',
  ]

  const metrics = ['Win Rate', 'BB Per Hour', 'Net Total']

  const [userCashLocations, setUserCashLocations] = useState<Location[]>([])
  const [userTournamentLocations, setUserTournamentLocations] = useState<
    Location[]
  >([])
  const [userCashStakes, setUserCashStakes] = useState<Stakes[]>([])
  const [userCashGameTypes, setUserCashGameTypes] = useState<GameTypes[]>([])
  const [userTournamentGameTypes, setUserTournamentGameTypes] = useState<
    GameTypes[]
  >([])
  const [isDesktop, setIsDesktop] = useState(false)

  const getUserCashLocations = async () => {
    const locations = await getUserLocations(user, true)
    setUserCashLocations(locations)
  }

  const getUserTournamentLocations = async () => {
    const locations = await getUserLocations(user, false)
    setUserTournamentLocations(locations)
  }

  const getUserCashGameTypes = async () => {
    const gameTypes = await getUserGameTypes(user, true)
    setUserCashGameTypes(gameTypes)
  }

  const getUserTournamentGameTypes = async () => {
    const gameTypes = await getUserGameTypes(user, false)
    setUserTournamentGameTypes(gameTypes)
  }

  const getUserCashStakes = async () => {
    const stakes = await getUserStakes(user, true)
    setUserCashStakes(stakes)
  }

  useEffect(() => {
    getUserCashLocations()
    getUserTournamentLocations()
    getUserCashGameTypes()
    getUserTournamentGameTypes()
    getUserCashStakes()
    const updateScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1280)
    }
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => {
      window.removeEventListener('resize', updateScreenSize)
    }
  }, [])

  const commonProps = {
    cashLocations: userCashLocations,
    tournamentLocations: userTournamentLocations,
    cashStakes: userCashStakes,
    cashGameTypes: userCashGameTypes,
    tournamentGameTypes: userTournamentGameTypes,
    userId: user,
    times,
    metrics,
  }

  return <Dashboard {...commonProps} />
}

export default DashboardMain
