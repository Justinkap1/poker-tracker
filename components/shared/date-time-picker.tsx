'use client'

import { DatePicker } from "@nextui-org/react";
import { now, getLocalTimeZone } from "@internationalized/date";

export default function DateTimePicker({ value, onChange, label, name }: { value: any, onChange: (value: any) => void, label: string, name: string }) {
    return (
        <div className="w-full min-w-100 max-w-100 flex flex-row gap-4">
            <DatePicker
                hideTimeZone
                showMonthAndYearPickers
                value={value}
                onChange={onChange}
                label={label}
                variant="bordered"
            />
        </div>
    );
}