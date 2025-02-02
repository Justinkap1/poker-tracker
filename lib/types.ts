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

export const cashSortFormSchema = z.object({
  game_type: z.boolean().optional(),
  location: z.boolean().optional(),
  stake: z.boolean().optional(),
  buyin: z.boolean().optional(),
  cashout: z.boolean().optional(),
  net_result: z.boolean().optional(),
  start_time: z.boolean().optional(),
  end_time: z.boolean().optional(),
  time_played: z.boolean().optional(),
})

export type cashSortForm = z.infer<typeof cashSortFormSchema>

export const tournamentSortFormSchema = z.object({
  game_type: z.boolean().optional(),
  location: z.boolean().optional(),
  placement: z.boolean().optional(),
  buyin: z.boolean().optional(),
  cashout: z.boolean().optional(),
  net_result: z.boolean().optional(),
  start_time: z.boolean().optional(),
  end_time: z.boolean().optional(),
  days: z.boolean().optional(),
})

export type tournamentSortForm = z.infer<typeof tournamentSortFormSchema>

export const ascendingFormSchema = z.object({
  ascending: z.string(),
})

export type ascendingForm = z.infer<typeof ascendingFormSchema>
