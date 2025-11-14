import Hero from '@/components/Hero'
import Agenda from '@/components/Agenda'
import NewsFeed from '@/components/NewsFeed'
import PracticalInfo from '@/components/PracticalInfo'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Agenda />
      <NewsFeed />
      <PracticalInfo />
      <Footer />
    </main>
  )
}

