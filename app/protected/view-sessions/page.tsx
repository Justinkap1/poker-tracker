import { getUserCashSessions, getUserTournamentSessions } from '@/api/api'
import { Session, TournamentSession } from '@/lib/interfaces'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SessionTable from './components/session-table'

export default async function EditSession() {
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
    userCashSessions = await getUserCashSessions(user.id)
  } catch (err) {
    console.error('error fetching user cash sessions:', err)
  }

  try {
    userTournamentSessions = await getUserTournamentSessions(user.id)
  } catch (err) {
    console.error('error fetching user tournament sessions')
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full py-12 px-20 justify-start items-center">
      <SessionTable
        cashSessions={userCashSessions}
        tournamentSessions={userTournamentSessions}
      />
      <div className="flex flex-row gap-1 text-gray-600 text-sm items-center justify-center">
        <span>Need to input another session? Add a</span>
        <Link href="/protected/add-cash-session" className="hover:text-white">
          cash session
        </Link>
        <span>or a</span>
        <Link
          href="/protected/add-tournament-session"
          className="hover:text-white"
        >
          tournament session
        </Link>
      </div>
    </div>
  )
}
