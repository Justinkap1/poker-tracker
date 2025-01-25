import { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';

import { cn } from '@/lib/utils';

export const FormInput = <TFieldValues extends FieldValues>({
    label,
    required,
    placeholder,
    type,
    id,
    error,
    register,
}: {
    label?: string;
    required: boolean;
    placeholder: string;
    type: string;
    id: FieldPath<TFieldValues>;
    error?: string;
    register: UseFormRegister<TFieldValues>;
}) => {
    return (
        <div className="flex flex-col flex-wrap justify-between">
            {label && (<label className="flex text-primary" htmlFor={id}>
                {label}
                <span className="text-destructive">{required && '*'}</span>
            </label>)}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                className={cn('w-full border rounded-md p-2')}
                {...register(id)}
            />
            <span className="text-destructive">{error}</span>
        </div>
    );
};