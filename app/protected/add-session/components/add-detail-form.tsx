'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialogue"
import { Button } from "@/components/ui/button"
import { AddDetailFormProps } from "@/lib/interfaces"
import { createClient } from "@/utils/supabase/client"
import { SquarePlus } from "lucide-react"
import { useState } from "react"

const AddDetailForm: React.FC<AddDetailFormProps> = ({ detail, locations, stakes, game_types, user_id }) => {

    const supabase = createClient();

    let options: string[] = [];
    let dbTable = ""
    let dbColumn = ""

    if (detail === "Location") {
        options = locations.map((loc) => loc);
        dbTable = "locations"
        dbColumn = "location"
    } else if (detail === "Game Type") {
        options = game_types.map((type) => type);
        dbTable = "game_types"
        dbColumn = "game_type"
    } else if (detail === "Stake") {
        options = stakes.map((stk) => stk);
        dbTable = "stakes"
        dbColumn = "stake"
    }

    let originalArray = options
    const [formData, setFormData] = useState<string[]>(options);

    const handleChange = (index: number, value: string) => {
        const updatedOptions = [...formData];
        updatedOptions[index] = value;
        setFormData(updatedOptions);
    };

    const handleDelete = (index: number) => {
        const updatedOptions = formData.filter((_, idx) => idx !== index);
        setFormData(updatedOptions);
    };

    const handleAddition = () => {
        setFormData([...formData, ""]); // Add an empty string to the array
    };

    const handleCancel = () => {
        setFormData(originalArray)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation(); 
        console.log(formData)

        const itemsToAdd = formData.filter((item) => !originalArray.includes(item) && item.trim() !== "");
        const itemsToDelete = originalArray.filter((item) => !formData.includes(item));
        const itemsToUpdate = formData.filter((item, index) => originalArray[index] && originalArray[index] !== item);

        //console.log(itemsToAdd, itemsToDelete, itemsToUpdate, dbTable, dbColumn)

        try {
            const currentDate = new Date().toISOString().split("T")[0];

            if (itemsToAdd.length > 0) {
                const { error: addError } = await supabase.from(dbTable).insert(
                    itemsToAdd.map((item) => ({
                        user_id: user_id,
                        [dbColumn]: item,
                        created_at: currentDate
                    }))
                )
                if (addError){
                    console.error("Error adding items:", addError.message);
                }
            }

            if (itemsToDelete.length > 0) {
                const { error: deleteError } = await supabase
                .from(dbTable)
                .delete()
                .in(dbColumn, itemsToDelete)
                .eq("user_id", user_id);

                if (deleteError) {
                    console.error("Error deleting items:", deleteError.message);
                }
            }

            for (const item of itemsToUpdate) {
                const originalIndex = originalArray.findIndex((orig) => orig === item);
                const newValue = formData[originalIndex];
    
                const { error: updateError } = await supabase
                    .from(dbTable)
                    .update({ [dbColumn]: newValue })
                    .eq(dbColumn, originalArray[originalIndex])
                    .eq("user_id", user_id)
    
                if (updateError) {
                    console.error("Error updating item:", updateError.message);
                }
            }

            originalArray = formData
            
        } catch {
            console.error("error connecting to supabase and updating")
        }
    }

    return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="p-2 h-8 w-8"><SquarePlus width={25} height={25}/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add or edit a {detail.toLowerCase()}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
            Click the + to add a {detail.toLowerCase()} and the - to delete it. Make sure to save your changes or click cancel to revert them.
        </AlertDialogDescription>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {formData.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="p-2 border rounded-md"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="p-3"
                            onClick={() => handleDelete(index)}
                        >
                            -
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    className="p-3"
                    onClick={() => handleAddition()}
                >
                    +
                </Button>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => handleCancel()}>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Save</AlertDialogAction>
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
    )
}

export default AddDetailForm