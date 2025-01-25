import Image from "next/image"
import { CirclePlus, ChartBarIncreasing, Pencil, CircleUserRound, LogOut } from "lucide-react"
import { signOutAction } from "@/app/actions"

export default function Sidebar() {
    return (
        <div className="flex flex-col h-screen bg-[#F6F6F6] text-black w-32 justify-between py-12 border-r border-2">
            <div className="flex justify-center">
                <Image
                    src="/pokerChip.jpg"
                    alt="Poker Chip"
                    width={84}
                    height={84}
                />
            </div>
            <ul className="flex flex-col justify-center items-center gap-4">
                <a href="/protected"><ChartBarIncreasing width={40} height={40} /></a>
                <a href="/protected/add-session"><CirclePlus width={40} height={40} /></a>
                <a href="/protected/notes"><Pencil width={40} height={40} /></a>
            </ul>
            <ul className="flex flex-col justify-center items-center gap-2">
                <a href="/protected/profile"><CircleUserRound width={40} height={40} /></a>
                <button onClick={signOutAction}>
                    <LogOut width={32} height={32} />
                </button>
            </ul>
        </div>
    )
}