'use client'

import { TournamentFormProps } from '@/lib/interfaces'
import { addTournamentForm, addTournamentFormSchema } from '@/lib/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import AddDetailForm from '../../../../components/shared/add-detail-form'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'

const TournamentForm: React.FC<TournamentFormProps> = ({
  userId,
  locations,
  game_types,
  currentSession,
  isCash,
}) => {
  //console.log(locations, game_types)
  const tournamentFormItems: Array<{
    name: keyof addTournamentForm
    label: string
    placeholder: string
    required: boolean
    options?: string[]
  }> = [
    {
      name: 'game_type',
      label: 'Game Type',
      placeholder: 'Select game type',
      required: true,
      options: game_types.map((type) => type.game_type),
    },
    {
      name: 'location',
      label: 'Location',
      placeholder: 'Select location',
      required: true,
      options: locations.map((loc) => loc.location),
    },
    {
      name: 'days',
      label: 'Number of Days',
      placeholder: '2',
      required: true,
    },
    {
      name: 'buyin',
      label: 'Buy In',
      placeholder: 'Enter buy in',
      required: true,
    },
    {
      name: 'cashout',
      label: 'Cash Out',
      placeholder: 'Enter cash out',
      required: true,
    },
    {
      name: 'placement',
      label: 'Placement',
      placeholder: '32',
      required: true,
    },
    {
      name: 'start_time',
      label: 'Start Time',
      placeholder: 'Enter start date',
      required: true,
    },
    {
      name: 'end_time',
      label: 'End Time',
      placeholder: 'Enter end date',
      required: true,
    },
  ]
  const form = useForm<addTournamentForm>({
    resolver: zodResolver(addTournamentFormSchema),
    defaultValues: {
      game_type: currentSession?.game_type || '',
      location: currentSession?.location || '',
      buyin: currentSession?.buyin || 0,
      placement: currentSession?.placement || 0,
      cashout: currentSession?.cashout || 0,
      start_time: currentSession?.start_time || '',
      end_time: currentSession?.end_time || '',
      days: currentSession?.days || 0,
    },
  })

  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const supabase = createClient()

  const handleAddTournamentSession = async (data: addTournamentForm) => {
    try {
      const { error } = await supabase.from('tournament_sessions').insert([
        {
          ...data,
          user_id: userId,
        },
      ])
      if (error) {
        console.error('Error inserting data:', error.message)
        alert('Error submitting session data.')
        setSubmitting(false)
      }
      setSuccessMessage('Your session has been recorded')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong.')
    }
  }

  const handleUpdateTournamentSession = async (data: addTournamentForm) => {
    let updated = false
    try {
      const { error } = await supabase
        .from('tournament_sessions')
        .update({
          game_type: data.game_type,
          location: data.location,
          days: data.days,
          buyin: data.buyin,
          cashout: data.cashout,
          placement: data.placement,
          start_time: data.start_time,
          end_time: data.end_time,
        })
        .eq('id', currentSession?.id)
      if (error) {
        console.error('There was an error trying to update session', error)
      } else {
        updated = true
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong.')
    }

    if (updated) {
      redirect('/protected/view-sessions')
    }
  }

  const onSubmit = async (values: addTournamentForm) => {
    setSubmitting(true)
    currentSession
      ? handleUpdateTournamentSession(values)
      : handleAddTournamentSession(values)
    setSubmitting(false)
    form.reset()
  }
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <span className="text-green-500">{successMessage}</span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4 min-w-[500px] max-w-[500px] border-gray-500 drop-shadow-lg rounded-md p-8 bg-[#F6F6F6]"
        >
          <div className="flex flex-col justify-center items-center">
            <div className="text-5xl font-bold">
              {currentSession ? 'Edit Session' : 'Add Session'}
            </div>
            <div className="text-md text-gray-600">TOURNAMENT</div>
          </div>
          {tournamentFormItems.map((item, index) => (
            <FormField
              control={form.control}
              name={item.name}
              key={index}
              render={({ field }) => (
                <FormItem className="flex flex-row gap-2 items-center">
                  <FormLabel className="flex items-center text-md min-w-40 max-w-40">
                    {item.label}
                  </FormLabel>
                  <div className="flex flex-col">
                    <FormControl className="flex items-center">
                      {item.name === 'start_time' ||
                      item.name === 'end_time' ? (
                        <input
                          type="date"
                          className="border border-black rounded-md px-3 py-2 truncate w-[270px]"
                          placeholder={item.placeholder}
                          required={item.required}
                          {...field}
                        />
                      ) : item.options ? (
                        <div className="flex flex-row gap-4 justify-center items-center">
                          <select
                            required={item.required}
                            className="border border-black rounded-md px-3 py-2 truncate w-[224px]"
                            {...field}
                          >
                            <option value="" disabled hidden>
                              {item.placeholder}
                            </option>
                            {item.options.map((option, index) => (
                              <option value={option} key={index} className="">
                                {option}
                              </option>
                            ))}
                          </select>
                          <AddDetailForm
                            detail={item.label}
                            locations={locations.map((loc) => loc.location)}
                            game_types={game_types.map(
                              (type) => type.game_type
                            )}
                            user_id={userId}
                            isCash={isCash}
                          />
                        </div>
                      ) : (
                        <input
                          type="number"
                          className="border border-black rounded-md px-3 py-2 truncate w-[270px]"
                          placeholder={item.placeholder}
                          required={item.required}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ''
                                ? ''
                                : Number(e.target.value)
                            )
                          }
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          ))}
          <InteractiveHoverButton className="w-[1/2] mt-2" type="submit">
            {submitting
              ? 'Submitting...'
              : currentSession
                ? 'Update Session'
                : 'Add Session'}
          </InteractiveHoverButton>
        </form>
      </Form>
    </div>
  )
}

export default TournamentForm
