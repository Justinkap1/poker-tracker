import CashForm from "@/app/protected/add-cash-session/components/add-cash-session-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Location, Stakes, GameTypes, Session } from "@/lib/interfaces";
import { getUserGameTypes, getUserLocations, getUserCashSessionByID, getUserStakes } from "@/api/api";
import { FormMessage, Message } from "@/components/shared/form-message";

export default async function AddCashSession(props: { searchParams: Promise<Message> }) {
    const isCash = true;
    const searchParams = await props.searchParams;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    let userSession: Session[] = []

    if ("session" in searchParams) {
        try {
            userSession = await getUserCashSessionByID(user.id, searchParams.session);
        } catch (err) {
            console.error("Error fetching user sessions:", err)
        }
    }

    if (userSession.length > 0) {
        const formattedStart = new Date(userSession[0].start_time)
        const formattedEnd = new Date(userSession[0].end_time)
        userSession[0].start_time = formattedStart.toISOString().slice(0, 16)
        userSession[0].end_time = formattedEnd.toISOString().slice(0, 16)
    }

    let userStakes: Stakes[] = [];
    let userLocations: Location[] = [];
    let userGameTypes: GameTypes[] = [];

    try {
        userLocations = await getUserLocations(user.id, isCash);
    } catch (err) {
        console.error("Error fetching user locations:", err);
    }

    try {
        userStakes = await getUserStakes(user.id, isCash);
    } catch (err) {
        console.error("Error fetching user stakes:", err);
    }

    try {
        userGameTypes = await getUserGameTypes(user.id, isCash);
    } catch (err) {
        console.error("Error fetching user game types:", err);
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full py-8 px-20 justify-center items-center">
            <CashForm userId={user.id} locations={userLocations} stakes={userStakes} game_types={userGameTypes} currentSession={userSession[0]} />
            {!("session" in searchParams) && (
                <FormMessage message={searchParams} />
            )}
        </div>
    );
}
