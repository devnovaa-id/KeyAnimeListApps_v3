// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'KeyAnimeListApps - Streaming Anime Terlengkap',
    template: '%s | KeyAnimeListApps'
  },
  description: 'Nonton anime subtitle Indonesia gratis dengan kualitas tinggi. Daftar anime terbaru, jadwal rilis, dan genre lengkap.',
  keywords: 'anime, streaming, subtitle Indonesia, nonton anime, anime terbaru',
  authors: [{ name: 'KeyAnimeListApps Team' }],
  openGraph: {
    title: 'KeyAnimeListApps - Streaming Anime Terlengkap',
    description: 'Nonton anime subtitle Indonesia gratis dengan kualitas tinggi.',
    type: 'website',
    locale: 'id_ID',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-dark-900 text-white min-h-screen`}>
        <Header />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}