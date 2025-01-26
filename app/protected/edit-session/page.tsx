import { getUserSessions } from "@/api/api";
import { Session } from "@/lib/interfaces";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Notes() {

    const supabase = await createClient();
    
    const {
        data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
        return redirect("/sign-in");
    }

    let userSessions: Session[] = []

    try {
        userSessions = await getUserSessions(user.id)
    } catch (err) {
        console.error("error fetching user sessions:", err)
    }

    //console.log(userSessions)

    return (
        <div className="flex flex-col w-full h-full p-8 pl-20 gap-4">
            <div className="text-7xl font-bold">Edit Session</div>
            {userSessions.map((session, index) => (
                <div key={index} className="flex flex-col gap-1 border justify-evenly"> 
                    <span>Game type: {session.game_type}</span>
                    <span>Stakes: {session.stake}</span>
                    <span>Location: {session.location}</span>
                    <span>Buy in: ${session.buyin}</span>
                    <span>Cash out: ${session.cashout}</span>
                    <span>Start Time: {session.start_time}</span>
                    <span>End Time: {session.end_time}</span>
                    <span>Time Played: {Math.round(session.time_played * 100)/100} Hours</span>
                    <span>Net Result: {session.net_result > 0 ? "+" : "-"}${Math.abs(session.net_result)}</span>
                </div>
            ))}
        </div>
    );
}