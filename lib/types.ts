import { z } from 'zod'

export const addSessionFormSchema = z.object({
  game_type: z.string().min(1, 'Please select a valid game type'),
  stake: z.string().min(1, 'Please select a valid stake for your game'),
  location: z.string().min(1, 'Please select a valid location for your game'),
  buyin: z
    .number({
      invalid_type_error: 'must be a number 0 or above',
    })
    .min(0, 'must be a number 0 or above'),
  cashout: z
    .number({
      invalid_type_error: 'must be a number 0 or above',
    })
    .min(0, 'must be a number 0 or above'),
  start_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid datetime string.'),
  end_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid datetime string.'),
})

export type addSessionForm = z.infer<typeof addSessionFormSchema>

export const addTournamentFormSchema = addSessionFormSchema
  .pick({
    game_type: true,
    buyin: true,
    location: true,
    start_time: true,
    end_time: true,
    cashout: true,
  })
  .extend({
    placement: z.number().min(1, 'Please enter a number 1 or above'),
    days: z.number().min(1, 'Please enter a number 1 or above'),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.start_time).setHours(0, 0, 0, 0)
      const endDate = new Date(data.end_time).setHours(0, 0, 0, 0)
      return startDate <= endDate
    },
    {
      message:
        'The tournament must end on the same day or later than it starts',
      path: ['end_time'],
    }
  )

export type addTournamentForm = z.infer<typeof addTournamentFormSchema>
