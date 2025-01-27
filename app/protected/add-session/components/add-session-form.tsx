'use client'

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { addSessionFormSchema, addSessionForm } from '@/lib/types';
import AddDetailForm from "../components/add-detail-form"
import { encodedRedirect } from '@/utils/utils';
import { Session, FormProps } from '@/lib/interfaces';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

const FormResponse: React.FC<FormProps> = ({
    userId,
    locations,
    stakes,
    game_types,
    currentSession
}) => {

    const formItems: Array<{
        name: keyof addSessionForm;
        label: string;
        placeholder: string;
        required: boolean;
        options?: string[];
    }> = [
            { name: "game_type", label: "Game Type", placeholder: "Select game type", required: true, options: game_types.map((type) => type.game_type) },
            { name: "stake", label: "Stake", placeholder: "Select stake", required: true, options: stakes.map((stk) => stk.stake) },
            { name: "location", label: "Location", placeholder: "Select location", required: true, options: locations.map((loc) => loc.location) },
            { name: "buyin", label: "Buy In", placeholder: "Enter buy in", required: true },
            { name: "cashout", label: "Cash Out", placeholder: "Enter cash out", required: true },
            { name: "start_time", label: "Start Time", placeholder: "Enter start time", required: true },
            { name: "end_time", label: "End Time", placeholder: "Enter end time", required: true }
        ];
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        game_type: currentSession?.game_type || "",
        stake: currentSession?.stake || "",
        location: currentSession?.location || "",
        buyin: currentSession?.buyin || "",
        cashout: currentSession?.cashout || "",
        start_time: currentSession?.start_time || "",
        end_time: currentSession?.end_time || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const supabase = createClient();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleUpdateSession = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        let updated = false

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
                end_time: "End time must be after the start time.",
            });
            setSubmitting(false);
            return;
        }

        setErrors({});

        try {
            const { error } = await supabase
                .from("sessions")
                .update({
                    game_type: parsedData.game_type,
                    location: parsedData.location,
                    stake: parsedData.stake,
                    buyin: parsedData.buyin,
                    cashout: parsedData.cashout,
                    start_time: parsedData.start_time,
                    end_time: parsedData.end_time
                })
                .eq("id", currentSession?.id)

            if (error) {
                console.error("There was an error trying to update session", error)
            } else {
                updated = true
                setSubmitting(false)
            }
        } catch (err) {
            console.error("Error:", err)
            alert("Something went wrong")
        }

        if (updated) {
            encodedRedirect(
                "success",
                "/protected/view-sessions",
                `Your session has been updated successfully!`
            )
        }
    }

    const handleAddSession = async (e: React.FormEvent<HTMLFormElement>) => {
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
                end_time: "End time must be after the start time.",
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
        encodedRedirect(
            "success",
            "/protected/add-session",
            `Your session has been added successfully!`
        )
    };

    return (
        <form
            className="flex flex-col items-center gap-6 min-w-[500px] max-w-[500px] border-gray-500 drop-shadow-lg rounded-md p-8 bg-[#F6F6F6]"
            onSubmit={currentSession ? handleUpdateSession : handleAddSession}
        >
            <div className="text-5xl font-bold">{currentSession ? "Edit Session" : "Add Session"}</div>
            {formItems.map((item, index) => (
                <div className="flex flex-row gap-2" key={index}>
                    <Label
                        htmlFor={item.name}
                        className="flex items-center text-md min-w-40 max-w-40">
                        {item.label}
                    </Label>
                    <div className="flex flex-col">
                        <div className="flex flex-col rounded-md">
                            {item.name === 'start_time' || item.name === 'end_time' ? (
                                <input
                                    type="datetime-local"
                                    name={item.name}
                                    value={formData[item.name]}
                                    onChange={handleChange}
                                    placeholder={item.placeholder}
                                    className="border border-black rounded-md px-3 py-2 truncate w-[270px]"
                                    required
                                />
                            ) : item.options ? (
                                <div className="flex flex-row gap-4 justify-center items-center">
                                    <select name={item.name}
                                        value={formData[item.name]}
                                        onChange={handleChange}
                                        required
                                        className="border border-black rounded-md px-3 py-2 truncate w-[224px]">
                                        <option value="" disabled hidden>{item.placeholder}</option>
                                        {item.options.map((option, index) => (
                                            <option value={option} key={index} className="">{option}</option>
                                        ))}
                                    </select>
                                    <AddDetailForm
                                        detail={item.label}
                                        locations={locations.map((loc) => loc.location)}
                                        stakes={stakes.map((stk) => stk.stake)}
                                        game_types={game_types.map((type) => type.game_type)}
                                        user_id={userId}
                                    />
                                </div>
                            ) : (
                                <input
                                    type="number"
                                    name={item.name}
                                    value={formData[item.name]}
                                    onChange={handleChange}
                                    placeholder={item.placeholder}
                                    className="border border-black rounded-md px-3 py-2 truncate w-[270px]"
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
            <InteractiveHoverButton
                className='w-[1/2]'
            >
                {submitting ? "Submitting..." : (currentSession ? "Update Session" : "Add Session")}
            </InteractiveHoverButton>
        </form>
    );
};

export default FormResponse;