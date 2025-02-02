import { FormMessage, Message } from '@/components/shared/form-message'
import TournamentForm from './components/add-tournament-session-form'
import { GameTypes, Location, TournamentSession } from '@/lib/interfaces'
import {
  getUserGameTypes,
  getUserLocations,
  getUserTournamentSessionByID,
} from '@/api/api'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AddTournamentSession(props: {
  searchParams: Promise<Message>
}) {
  const isCash = false
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/sign-in')
  }

  let userTournamentSession: TournamentSession[] = []
  let userLocations: Location[] = []
  let userGameTypes: GameTypes[] = []

  try {
    userLocations = await getUserLocations(user.id, isCash)
  } catch (err) {
    console.error('Error fetching user locations:', err)
  }

  try {
    userGameTypes = await getUserGameTypes(user.id, isCash)
  } catch (err) {
    console.error('Error fetching user game types:', err)
  }

  if ('tournament_session' in searchParams) {
    try {
      userTournamentSession = await getUserTournamentSessionByID(
        user.id,
        searchParams.tournament_session
      )
    } catch (err) {
      console.error('Error fetching user sessions:', err)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full py-8 px-20 justify-center items-center">
      <TournamentForm
        game_types={userGameTypes}
        locations={userLocations}
        userId={user.id}
        isCash={isCash}
        currentSession={userTournamentSession[0]}
      />
    </div>
  )
}
