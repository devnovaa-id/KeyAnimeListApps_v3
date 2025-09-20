// app/page.tsx
import HeroSection from '@/components/hero-section'
import AnimeGrid from '@/components/anime/anime-grid'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Anime Terbaru</h2>
        <AnimeGrid />
      </div>
    </div>
  )
}