import { Message } from "@/components/shared/form-message";
import TournamentForm from "./components/add-tournament-session-form";
import { GameTypes, Location } from "@/lib/interfaces";
import { getUserGameTypes, getUserLocations } from "@/api/api";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AddTournamentSession(props: { searchParams: Promise<Message> }) {
    const isCash = false;
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    
    const {
        data: { user },
    } = await supabase.auth.getUser();    
    if (!user) {
        return redirect("/sign-in");
    }

    let userLocations: Location[] = [];
    let userGameTypes: GameTypes[] = [];
    
    try {
        userLocations = await getUserLocations(user.id, isCash);
    } catch (err) {
        console.error("Error fetching user locations:", err);
    }

    try {
        userGameTypes = await getUserGameTypes(user.id, isCash);
    } catch (err) {
        console.error("Error fetching user game types:", err);
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full py-8 px-20 justify-center items-center">
            <TournamentForm game_types={userGameTypes} locations={userLocations} userId={user.id}/>
        </div>
    )
}