import { getUserSessions } from "@/api/api";
import { FormMessage, Message } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { Session } from "@/lib/interfaces";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditSession(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams;
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

    return (
        <div className="flex flex-col w-full h-full py-8 px-20">
            <FormMessage message={searchParams} />
            <div className="text-5xl font-bold text-center">View Sessions</div>
            {userSessions.length === 0 && (
                <div className="flex flex-row items-center gap-1">
                    <span>You have no sessions recorded. Go to the</span>
                    <Link href="/protected/add-session" className="underline hover:text-[#C6E4EE]">
                        add sessions page
                    </Link>
                    <span>to get started</span>
                </div>
            )}
            <div className="mt-4">
                {userSessions.map((session, index) => (
                    <div key={index} className="flex flex-col gap-1 justify-evenly">
                        <span>Game type: {session.game_type}</span>
                        <span>Stakes: {session.stake}</span>
                        <span>Location: {session.location}</span>
                        <span>Buy in: ${session.buyin}</span>
                        <span>Cash out: ${session.cashout}</span>
                        <span>Start Time: {session.start_time}</span>
                        <span>End Time: {session.end_time}</span>
                        {session.time_played && (
                            <span>Time Played: {Math.round(session.time_played * 100) / 100} Hours</span>
                        )}
                        {session.net_result && (
                            <span>Net Result: {session.net_result > 0 ? "+" : "-"}${Math.abs(session.net_result)}</span>
                        )}
                        {session.id && (
                            <Link href={`/protected/add-session?session=${session.id}`}>
                                <Button>Edit Session</Button>
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}