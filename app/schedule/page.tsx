// app/schedule/page.tsx
import { Suspense } from 'react';
import ScheduleGrid from '@/components/ScheduleGrid';
import AdBanner from '@/components/AdBanner';
import { api } from '@/lib/api';

export const metadata = {
  title: 'Jadwal Rilis Anime',
  description: 'Jadwal rilis anime terbaru setiap hari. Pantau update anime favoritmu!',
};

async function getSchedule() {
  try {
    return await api.getSchedule();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

export default async function SchedulePage() {
  const schedule = await getSchedule();

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Jadwal Rilis <span className="text-gradient">Anime</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Pantau jadwal rilis anime favoritmu setiap hari
          </p>
        </div>

        {/* Ad Banner */}
        <div className="mb-8">
          <AdBanner />
        </div>

        {/* Schedule Grid */}
        <Suspense fallback={<div className="text-center py-8">Loading jadwal...</div>}>
          <ScheduleGrid schedule={schedule} />
        </Suspense>

        {/* Bottom Ad Banner */}
        <div className="mt-8">
          <AdBanner />
        </div>
      </div>
    </div>
  );
}