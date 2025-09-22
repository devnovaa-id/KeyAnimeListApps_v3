import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'KeyAnimeListApps - Daftar Anime Terlengkap',
    template: '%s | KeyAnimeListApps'
  },
  description: 'Temukan anime terbaru, jadwal tayang, dan info lengkap tentang berbagai judul anime hanya di KeyAnimeListApps.',
  keywords: 'anime, list anime, jadwal anime, anime terbaru, anime subtitle Indonesia',
  authors: [{ name: 'KeyAnimeListApps Team' }],
  creator: 'KeyAnimeListApps',
  publisher: 'KeyAnimeListApps',
  metadataBase: new URL('https://keyanimelistapps.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'KeyAnimeListApps - Daftar Anime Terlengkap',
    description: 'Temukan anime terbaru, jadwal tayang, dan info lengkap tentang berbagai judul anime.',
    url: 'https://keyanimelistapps.vercel.app',
    siteName: 'KeyAnimeListApps',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KeyAnimeListApps',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeyAnimeListApps - Daftar Anime Terlengkap',
    description: 'Temukan anime terbaru, jadwal tayang, dan info lengkap tentang berbagai judul anime.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-premium-dark via-gray-900 to-black">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}