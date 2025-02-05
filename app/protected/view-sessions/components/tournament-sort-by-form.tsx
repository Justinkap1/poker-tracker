'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  ascendingForm,
  ascendingFormSchema,
  tournamentSortForm,
  tournamentSortFormSchema,
} from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function TournamentSortBy() {
  const searchParams = useSearchParams().get('sortCashBy')
  const router = useRouter()
  const formItems: Array<{
    name: keyof tournamentSortForm
    label: string
  }> = [
    {
      name: 'game_type',
      label: 'Game Type',
    },
    {
      name: 'location',
      label: 'Location',
    },
    {
      name: 'placement',
      label: 'Placement',
    },
    {
      name: 'buyin',
      label: 'Buy In',
    },
    {
      name: 'cashout',
      label: 'Cash Out',
    },
    {
      name: 'net_result',
      label: 'Net Result',
    },
    {
      name: 'start_time',
      label: 'Start Date',
    },
    {
      name: 'end_time',
      label: 'End Date',
    },
    {
      name: 'days',
      label: 'Days',
    },
  ]
  const checkBoxForm = useForm<tournamentSortForm>({
    resolver: zodResolver(tournamentSortFormSchema),
    defaultValues: {
      game_type: searchParams === 'game_type' ? true : false,
      location: searchParams === 'location' ? true : false,
      placement: searchParams === 'placement' ? true : false,
      buyin: searchParams === 'buyin' ? true : false,
      cashout: searchParams === 'cashout' ? true : false,
      net_result: searchParams === 'net_result' ? true : false,
      start_time: searchParams === 'start_time' ? true : false,
      end_time: searchParams === 'end_time' ? true : false,
      days: searchParams === 'days' ? true : false,
    },
  })
  const ascendingForm = useForm<ascendingForm>({
    resolver: zodResolver(ascendingFormSchema),
    defaultValues: {
      ascending: 'ascending',
    },
  })
  const onSubmit = () => {
    console.log(checkBoxForm.getValues(), ascendingForm.getValues())
    const selectedField = Object.entries(checkBoxForm.getValues()).find(
      ([key, value]) => value === true
    )
    const ascending =
      ascendingForm.getValues().ascending === 'ascending'
        ? 'ascending'
        : 'descending'
    const searchParams = new URLSearchParams()
    searchParams.set('order', ascending)
    if (selectedField) {
      searchParams.set('sortTournamentBy', selectedField[0])
      router.push(`/protected/view-sessions?${searchParams.toString()}`)
    } else {
      router.push(`/protected/view-sessions?${searchParams.toString()}`)
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <Form {...checkBoxForm}>
        <form className="flex flex-col gap-2 items-center justify-center">
          <div className="grid grid-cols-3 md:grid-cols-5 w-full justify-items-center items-end">
            {formItems.map((item, index) => (
              <FormField
                control={checkBoxForm.control}
                name={item.name}
                key={index}
                render={({ field }) => (
                  <FormItem className="flex flex-row gap-1 items-end">
                    <FormLabel className="text-[10px] w-[60px]">
                      {item.label}
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            checkBoxForm.reset({
                              game_type: false,
                              location: false,
                              placement: false,
                              buyin: false,
                              cashout: false,
                              net_result: false,
                              start_time: false,
                              end_time: false,
                              days: false,
                              [item.name]: true,
                            })
                          } else {
                            field.onChange(false)
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </form>
      </Form>
      <Form {...ascendingForm}>
        <form className="flex items-center justify-center">
          <FormField
            control={ascendingForm.control}
            name={'ascending'}
            key={'ascending'}
            render={({ field }) => (
              <select
                className="border border-black rounded-md p-1 truncate w-[100px] text-[10px]"
                {...field}
              >
                <option value="ascending" className="text-[10px]">
                  Low to High
                </option>
                <option value="descending" className="text-[10px]">
                  High to Low
                </option>
              </select>
            )}
          />
        </form>
      </Form>
      <Button onClick={onSubmit} className="w-[10%] h-[30px] m-auto">
        Sort
      </Button>
    </div>
  )
}
