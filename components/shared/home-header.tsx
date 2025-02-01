import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function HomeHeader() {
  return (
    <nav className="flex sm:flex-row flex-col sm:justify-between justify-center h-[200px] sm:h-[100px] w-full px-10 sm:px-16 border items-center absolute top-0 gap-4">
      <div className="flex flex-row gap-4 items-center">
        <Image src="/pokerChip.jpg" alt="Poker Chip" width={84} height={84} />
        <span className="text-4xl">Poker Tracker</span>
      </div>
      <div className="flex flex-row sm:gap-4 gap-6 items-center">
        <Link href="/sign-in">
          <Button size="lg" className="text-lg">
            Sign in
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="lg" className="text-lg">
            Sign up
          </Button>
        </Link>
      </div>
    </nav>
  )
}
