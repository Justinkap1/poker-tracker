import { bebas } from '@/lib/fonts'
import { MousePointer2 } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <div
      className={`${bebas.className} text-4xl sm:text-7xl flex flex-col gap-2 justify-center items-center border-2 sm:p-32 p-12 rounded-md bg-[radial-gradient(#CFDAFF_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_90%,transparent_100%)]`}
    >
      <span>Analyze your play</span>
      <span>Watch profit soar</span>
      <Link
        href="/sign-in"
        className="flex flex-row gap-2 text-2xl text-gray-600 items-center"
      >
        <span>Get started</span>
        <span>
          <MousePointer2 width={20} height={20} />
        </span>
      </Link>
    </div>
  )
}
