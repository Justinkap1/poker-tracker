import { getUserCashSessions, getUserTournamentSessions } from '@/api/api'
import { FormMessage, Message } from '@/components/shared/form-message'
import { Button } from '@/components/ui/button'
import { Session, TournamentSession } from '@/lib/interfaces'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SessionTable from './components/session-table'

export default async function EditSession(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
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
    <div className="flex flex-col gap-4 w-full h-full py-8 px-20 justify-center items-center">
      <FormMessage message={searchParams} />
      <SessionTable
        cashSessions={userCashSessions}
        tournamentSessions={userTournamentSessions}
      />
    </div>
  )
}
