import FormResponse from "@/components/shared/add-session-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Location, Stakes, GameTypes } from "@/lib/interfaces";
import { getUserGameTypes, getUserLocations, getUserStakes } from "@/app/actions";

export default async function AddSession() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    let userLocations: Location[] = [];
    let userStakes: Stakes[] = [];
    let userGameTypes: GameTypes[] = [];

    try {
        userLocations = await getUserLocations(user.id);
    } catch (err) {
        console.error("Error fetching user locations:", err);
    }

    try {
        userStakes = await getUserStakes(user.id);
    } catch (err) {
        console.error("Error fetching user stakes:", err);
    }

    try {
        userGameTypes = await getUserGameTypes(user.id);
    } catch (err) {
        console.error("Error fetching user game types:", err);
    }

    return (
        <div className="flex flex-col w-full h-full p-8 pl-20">
            <div className="text-7xl font-bold">Add Session</div>
            <FormResponse userId={user.id} locations={userLocations} stakes={userStakes} game_types={userGameTypes}/>
        </div>
    );
}
