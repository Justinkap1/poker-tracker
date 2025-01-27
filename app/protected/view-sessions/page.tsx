import { getUserSessions } from "@/api/api";
import { FormMessage, Message } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { Session } from "@/lib/interfaces";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import SessionTable from "./components/session-table";

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
        <div className="flex flex-col gap-4 w-full h-full py-8 px-20 justify-center items-center">
            <FormMessage message={searchParams} />
            {
                userSessions.length === 0 ? (
                    <div className="flex flex-row items-center gap-1">
                        <span>You have no sessions recorded. Go to the</span>
                        <Link href="/protected/add-session" className="underline hover:text-[#C6E4EE]">
                            add sessions page
                        </Link>
                        <span>to get started</span>
                    </div>
                ) : (
                    <SessionTable userSessions={userSessions} />
                )
            }
        </div>
    );
}