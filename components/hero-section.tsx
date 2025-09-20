// components/hero-section.tsx
import { Button } from '@/components/ui/button'
import { Play, Info } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <Image
        src="/hero-banner.jpg"
        alt="Hero Banner"
        fill
        className="object-cover brightness-50"
        priority
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Nikmati Pengalaman Menonton Anime Terbaik
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Streaming anime berkualitas tinggi dengan komunitas penggemar anime terbesar
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Play className="mr-2 h-5 w-5" />
              Mulai Menonton
            </Button>
            <Button size="lg" variant="secondary">
              <Info className="mr-2 h-5 w-5" />
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}