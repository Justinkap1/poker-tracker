import Hero from '@/components/shared/hero'
import HomeHeader from '@/components/shared/home-header'
import { bebas } from '@/lib/fonts'

export default async function Home() {
  return (
    <div
      className={`flex h-screen justify-center items-center w-full ${bebas.className}`}
    >
      <HomeHeader />
      <Hero />
    </div>
  )
}
