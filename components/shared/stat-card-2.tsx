'use client'
import { useEffect, useState } from 'react'
import { smooch } from '@/lib/fonts'
import { Loader, Spade, Tally5 } from 'lucide-react'

type StatCardProps = {
  totalSessions: number | undefined
  freqLocation: string | undefined
  freqStake: string | undefined
}

const StatCard2: React.FC<StatCardProps> = ({
  totalSessions,
  freqLocation,
  freqStake,
}) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [totalSessions])

  return (
    <div
      className={`flex flex-col gap-4 min-w-[320px] h-[210px] rounded-lg drop-shadow-lg p-4 bg-[#92D8EF]`}
    >
      <div
        className={`${smooch.className} flex flex-row justify-between items-start gap-2`}
      >
        <Spade width={100} height={100} />
        <div className="flex flex-col justify-center gap-1 p-3 rounded-md bg-black text-white w-[50%]">
          {loading ? (
            <Loader width={36} height={36} />
          ) : (
            <span
              className={`flex flex-row items-end text-3xl justify-between`}
            >
              <span className="text-3xl">{totalSessions}</span>
              <span className="text-lg">Total Sessions</span>
            </span>
          )}
          {loading ? (
            <Loader width={36} height={36} />
          ) : (
            <span
              className={`flex flex-row items-end text-3xl justify-between`}
            >
              <span className="text-3xl">{freqStake}</span>
              <span className="text-lg">Most Played</span>
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold">Most Sessions</span>
        <span className="text-xl">{freqLocation}</span>
      </div>
    </div>
  )
}

export default StatCard2
