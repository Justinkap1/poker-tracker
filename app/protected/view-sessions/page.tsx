import {
  getUserCashSessions,
  getUserTournamentSessions,
} from '@/api/api_server'
import { Session, TournamentSession } from '@/lib/interfaces'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SessionTable from './components/session-table'

export default async function ViewSessions({
  searchParams,
}: {
  searchParams: {
    sortCashBy?: string
    order?: string
    sortTournamentBy?: string
  }
}) {
  const resolvedParams = await Promise.resolve(searchParams)
  const sortCashBy = resolvedParams.sortCashBy
  const sortTournamentBy = resolvedParams.sortTournamentBy
  const order = resolvedParams.order === 'ascending' ? true : false
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  let userCashSessions: Session[] = []
  let userTournamentSessions: TournamentSession[] = []

  try {
    userCashSessions = await getUserCashSessions(user.id, sortCashBy, order)
  } catch (err) {
    console.error('error fetching user cash sessions:', err)
  }

  try {
    userTournamentSessions = await getUserTournamentSessions(
      user.id,
      sortTournamentBy,
      order
    )
  } catch (err) {
    console.error('error fetching user tournament sessions')
  }

  //console.log(userCashSessions, userTournamentSessions)

  return (
    <div className="flex flex-col gap-4 w-full h-full py-12 px-20 justify-start items-center">
      <SessionTable
        cashSessions={userCashSessions}
        tournamentSessions={userTournamentSessions}
      />
      <div className="flex flex-row gap-1 text-gray-600 text-sm items-center justify-center">
        <span>Need to input another session? Add a</span>
        <Link
          href="/protected/add-cash-session"
          className="hover:text-black hover:font-bold"
        >
          cash session
        </Link>
        <span>or a</span>
        <Link
          href="/protected/add-tournament-session"
          className="hover:text-black hover:font-bold"
        >
          tournament session
        </Link>
      </div>
    </div>
  )
}
