import FormResponse from "@/components/shared/add-session-form";
import { Message } from "@/components/shared/form-message";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AddSession() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex flex-col w-full h-full p-8 pl-20">
            <div className="text-7xl font-bold">Add Session</div>
            <FormResponse userId={user.id} />
        </div>
    );
}
