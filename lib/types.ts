import { z } from 'zod';

export const addSessionFormSchema = z.object({
    game_type: z.string().min(1, "Please select a valid game type"),
    stake: z.string().min(1, "Please select a valid stake for your game"),
    location: z.string().min(1, "Please select a valid location for your game"),
    buyin: z
        .number({
            invalid_type_error: "must be a number 0 or above",
        })
        .min(0, "must be a number 0 or above")
        .refine((val) => !isNaN(val), "must be a number 0 or above"),
    cashout: z
        .number({
            invalid_type_error: "must be a number 0 or above",
        })
        .min(0, "must be a number 0 or above")
        .refine((val) => !isNaN(val), "must be a number 0 or above"),
    start_time: z
        .string()
        .refine(
            (val) => !isNaN(Date.parse(val)),
            "Invalid datetime string."
        ),
    end_time: z
        .string()
        .refine(
            (val) => !isNaN(Date.parse(val)),
            "Invalid datetime string."
        ),
});

export type addSessionForm = z.infer<typeof addSessionFormSchema>;