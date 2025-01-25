'use client'

import { z } from 'zod';
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

interface formProps {
    userId: string;
}

const addSessionFormSchema = z.object({
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

type addSessionForm = z.infer<typeof addSessionFormSchema>;

const formItems: Array<{
    name: keyof addSessionForm;
    label: string;
    placeholder: string;
    required: boolean;
    options?: string[];
}> = [
        { name: "game_type", label: "Game Type", placeholder: "Select game type", required: true, options: ["No-Limit Texas Hold'em", "Pot-Limit Omaha", "7-Card Stud"] },
        { name: "stake", label: "Stake", placeholder: "Select stake", required: true, options: ["1/2", "2/5", "5/10"] },
        { name: "location", label: "Location", placeholder: "Select location", required: true, options: ["MGM National Harbor", "Hard Rock Hollywood", "Pulkit's Home Game"] },
        { name: "buyin", label: "Buy In", placeholder: "Enter buy in", required: true },
        { name: "cashout", label: "Cash Out", placeholder: "Enter cash out", required: true },
        { name: "start_time", label: "Start Time", placeholder: "Enter start time", required: true },
        { name: "end_time", label: "End Time", placeholder: "Enter end time", required: true }
    ];

const FormResponse: React.FC<formProps> = ({ userId }) => {
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        game_type: "",
        stake: "",
        location: "",
        buyin: "",
        cashout: "",
        start_time: "",
        end_time: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const supabase = createClient();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const parsedData = {
            game_type: formData.game_type,
            stake: formData.stake,
            location: formData.location,
            buyin: parseFloat(formData.buyin),
            cashout: parseFloat(formData.cashout),
            start_time: formData.start_time,
            end_time: formData.end_time
        }

        const result = addSessionFormSchema.safeParse(parsedData)
        if (!result.success) {
            const validationErrors: Record<string, string> = {};
            result.error.errors.forEach((error) => {
                if (error.path[0])
                    validationErrors[error.path[0] as string] = error.message;
            });
            setErrors(validationErrors);
            setSubmitting(false);
            return;
        }

        const startTimestamp = Date.parse(parsedData.start_time);
        const endTimestamp = Date.parse(parsedData.end_time);

        if (endTimestamp <= startTimestamp) {
            setErrors({
                endTime: "End time must be after the start time.",
            });
            setSubmitting(false);
            return;
        }

        setErrors({});

        try {
            const currentDate = new Date().toISOString().split("T")[0];

            const { error } = await supabase.from("sessions").insert([
                {
                    ...parsedData,
                    created_at: currentDate,
                    user_id: userId,
                },
            ]);

            if (error) {
                console.error("Error inserting data:", error.message);
                alert("Error submitting session data.");
                setSubmitting(false);
            } else {
                alert("Survey data submitted successfully!");
                setFormData({
                    game_type: "",
                    stake: "",
                    location: "",
                    buyin: "",
                    cashout: "",
                    start_time: "",
                    end_time: "",
                })
                setSubmitting(false);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <form
            className="flex flex-col min-w-100 max-w-100 border border-black border-2 rounded-md p-8 bg-[#F6F6F6]"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-medium">Add A Session</h1>
            {formItems.map((item, index) => (
                <div className="flex flex-row gap-2 mt-8" key={index}>
                    <Label
                        htmlFor={item.name}
                        className="flex items-center text-md min-w-40 max-w-40">
                        {item.label}
                    </Label>
                    <div className="flex flex-col">
                        <div className="flex flex-col border border-black rounded-md">
                            {item.name === 'start_time' || item.name === 'end_time' ? (
                                <input
                                    type="datetime-local"
                                    name={item.name}
                                    value={formData[item.name]}
                                    onChange={handleChange}
                                    placeholder={item.placeholder}
                                    className="rounded-md px-3 py-2"
                                    required
                                />
                            ) : item.options ? (
                                <select name={item.name}
                                    value={formData[item.name]}
                                    onChange={handleChange}
                                    required
                                    className="rounded-md px-3 py-2">
                                    <option value="" disabled hidden>{item.placeholder}</option>
                                    {item.options.map((option, index) => (
                                        <option value={option} key={index}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name={item.name}
                                    value={formData[item.name]}
                                    onChange={handleChange}
                                    placeholder={item.placeholder}
                                    className="rounded-md px-3 py-2"
                                    required
                                />
                            )}
                        </div>
                        {errors[item.name] && (
                            <p className="text-red-500 text-sm mt-1 pl-2">
                                {errors[item.name]}
                            </p>
                        )}
                    </div>
                </div>
            ))}
            <button
                className="mt-8 bg-black text-white rounded-md h-10 w-full"
                type="submit"
                disabled={submitting}
            >
                {submitting ? "Submitting..." : "Add Session"}
            </button>
        </form>
    );
};

export default FormResponse;