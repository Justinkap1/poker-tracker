import Sidebar from '@/components/shared/sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardMain from './dashboard'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  return (
    <div className="flex flex-col w-full h-full p-8 pl-20">
      <DashboardMain user={user.id} />
    </div>
  )
}
