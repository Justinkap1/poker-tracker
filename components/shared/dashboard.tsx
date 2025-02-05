'use client'

import { fetchBasePlayerCashData } from '@/api/api'
import { Stakes, Location, GameTypes } from '@/lib/interfaces'
import { useEffect, useState } from 'react'
import StatCard from './stat-card'
import StatCard2 from './stat-card-2'

type DashboardProps = {
  cashLocations: Location[]
  tournamentLocations: Location[]
  cashStakes: Stakes[]
  cashGameTypes: GameTypes[]
  tournamentGameTypes: GameTypes[]
  userId: string
  times: string[]
  metrics: string[]
}

export type PlayerCashDataProps = {
  totalProfit: number
  sessionCount: number
  totalTime: number
  freqLocation: string
  freqStake: string
  freqGameType: string
}

export type PlayerTournamentDataProps = {
  totalProfit: number
  totalTime: number
  freqLocation: string
  freqBuyin: string
}

const Dashboard: React.FC<DashboardProps> = ({
  cashLocations,
  tournamentLocations,
  cashStakes,
  cashGameTypes,
  tournamentGameTypes,
  userId,
  times,
  metrics,
}) => {
  const [selectedMode, setSelectedMode] = useState<string>('Cash')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedStake, setSelectedStake] = useState<string>('')
  const [selectedGameType, setSelectedGameType] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [cashWinCount, setCashWinCount] = useState<number | null>(null)
  const [tournamentWinCount, setTournamentWinCount] = useState<number | null>(
    null
  )
  const [playerCashData, setPlayerCashData] =
    useState<PlayerCashDataProps | null>(null)
  const [playerTournamentData, setPlayerTournamentData] =
    useState<PlayerTournamentDataProps | null>(null)

  const fetchPlayerCashData = async () => {
    const data = await fetchBasePlayerCashData(
      userId,
      selectedGameType,
      selectedStake,
      selectedLocation,
      selectedTime
    )
    setPlayerCashData(data)
  }

  useEffect(() => {
    fetchPlayerCashData()
  }, [
    selectedMode,
    selectedLocation,
    selectedStake,
    selectedGameType,
    selectedTime,
  ])

  //console.log(playerCashData)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-6xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
        <div className="col-span-3 flex flex-col gap-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <select
              className="px-3 block w-full py-2 text-[#273B59] text-[14px] font-medium bg-[#F8F9FF] border border-[#A3A3A3] rounded-md shadow-sm focus:outline-none hover:cursor-pointer"
              onChange={(e) => {
                const value = e.target.value
                setSelectedMode(value)
              }}
              value={selectedMode}
            >
              <option value="Cash">Cash</option>
              <option value="Tournament">Tournaments</option>
            </select>
            <select
              className="px-3 block w-full py-2 text-[#273B59] text-[14px] font-medium bg-[#F8F9FF] border border-[#A3A3A3] rounded-md shadow-sm focus:outline-none hover:cursor-pointer"
              onChange={(e) => {
                const value = e.target.value
                setSelectedLocation(value === 'All Locations' ? '' : value)
              }}
            >
              <option value="" disabled={selectedLocation !== ''} hidden>
                Select a Location
              </option>
              <option value="All Locations">All Locations</option>
              {selectedMode === 'Cash'
                ? cashLocations.map((location, index) => (
                  <option value={location.location} key={index}>
                    {location.location}
                  </option>
                ))
                : tournamentLocations.map((location, index) => (
                  <option value={location.location} key={index}>
                    {location.location}
                  </option>
                ))}
            </select>
            {selectedMode === 'Cash' && (
              <select
                className="px-3 block w-full py-2 text-[#273B59] text-[14px] font-medium bg-[#F8F9FF] border border-[#A3A3A3] rounded-md shadow-sm focus:outline-none hover:cursor-pointer"
                onChange={(e) => {
                  const value = e.target.value
                  setSelectedStake(value === 'All Stakes' ? '' : value)
                }}
              >
                <option value="" disabled={selectedStake !== ''} hidden>
                  Select a Stake
                </option>
                <option value="All Stakes">All Stakes</option>
                {cashStakes.map((stake, index) => (
                  <option value={stake.stake} key={index}>
                    {' '}
                    {stake.stake}
                  </option>
                ))}
              </select>
            )}
            <select
              className="px-3 block w-full py-2 text-[#273B59] text-[14px] font-medium bg-[#F8F9FF] border border-[#A3A3A3] rounded-md shadow-sm focus:outline-none hover:cursor-pointer"
              onChange={(e) => {
                const value = e.target.value
                setSelectedGameType(value === 'All Time' ? '' : value)
              }}
            >
              <option value="" disabled={selectedGameType !== ''} hidden>
                Select a Game Type
              </option>
              <option value="All Time">All Game Types</option>
              {selectedMode === 'Cash'
                ? cashGameTypes.map((game_type, index) => (
                  <option value={game_type.game_type} key={index}>
                    {game_type.game_type}
                  </option>
                ))
                : tournamentGameTypes.map((game_type, index) => (
                  <option value={game_type.game_type} key={index}>
                    {game_type.game_type}
                  </option>
                ))}
            </select>
            <select
              className="px-3 block w-full py-2 text-[#273B59] text-[14px] font-medium bg-[#F8F9FF] border border-[#A3A3A3] rounded-md shadow-sm focus:outline-none hover:cursor-pointer"
              onChange={(e) => {
                const value = e.target.value
                setSelectedTime(value === 'All Time' ? '' : value)
              }}
            >
              <option value="" disabled={selectedTime !== ''} hidden>
                All Time
              </option>
              <option value="All Time">All Time</option>
              {times.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <StatCard
                net_result={playerCashData?.totalProfit}
                total_time={playerCashData?.totalTime}
              />
              <StatCard2
                totalSessions={playerCashData?.sessionCount}
                freqLocation={playerCashData?.freqLocation}
                freqStake={playerCashData?.freqStake}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
