'use client'
import { useEffect, useState } from 'react'
import {
  Loader,
  ChartNoAxesCombined,
  MoveUp,
  MoveDown,
  Clock8,
} from 'lucide-react'
import { smooch } from '@/lib/fonts'

type StatCardProps = {
  net_result: number | undefined
  total_time: number | undefined
}

const StatCard: React.FC<StatCardProps> = ({ net_result, total_time }) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [net_result])

  const isPositive =
    net_result && net_result > 0 ? 'text-green-500' : 'text-red-500'

  const resultPerHour =
    net_result !== undefined && total_time !== undefined && total_time > 0
      ? (Math.round((net_result / total_time) * 100) / 100).toFixed(2)
      : 'N/A'

  return (
    <div
      className={`flex flex-col gap-4 w-[320px] h-[210px] rounded-lg drop-shadow-lg p-4 bg-[#92D8EF]`}
    >
      <div
        className={`${smooch.className} flex flex-row justify-between items-start gap-2`}
      >
        <ChartNoAxesCombined width={100} height={100} />
        <div className="flex flex-col justify-center gap-1 p-3 rounded-md bg-black text-white w-[50%]">
          {loading ? (
            <Loader />
          ) : (
            <span
              className={`flex flex-row items-center text-3xl justify-between ${isPositive}`}
            >
              {net_result && net_result > 0 ? <MoveUp /> : <MoveDown />}$
              {net_result && (Math.round(net_result * 100) / 100).toFixed(2)}
            </span>
          )}
          {loading ? (
            <Loader />
          ) : (
            <span className="flex flex-row items-center text-3xl justify-between">
              <Clock8 />
              {total_time && (Math.round(total_time * 100) / 100).toFixed(2)}H
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold">Net Result</span>
        <span className="text-xl">
          {Number(resultPerHour) > 0 ? '+' : '-'}
          {resultPerHour} per hour
        </span>
      </div>
    </div>
  )
}

export default StatCard
