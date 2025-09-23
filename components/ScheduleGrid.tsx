// components/ScheduleGrid.tsx
import { AnimeSchedule } from '@/types/anime';
import AnimeCard from './AnimeCard';

interface ScheduleGridProps {
  schedule: AnimeSchedule[];
}

export default function ScheduleGrid({ schedule }: ScheduleGridProps) {
  const daysOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu', 'Random'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {daysOrder.map((day) => {
        const daySchedule = schedule.find(s => s.hari === day);
        if (!daySchedule) return null;

        return (
          <div key={day} className="bg-dark-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gradient mb-4">{day}</h2>
            <div className="space-y-4">
              {daySchedule.anime.map((anime) => (
                <div key={anime.slug} className="flex space-x-3">
                  <div className="flex-shrink-0 w-16 h-20 bg-dark-700 rounded overflow-hidden">
                    {anime.gambar && (
                      <img
                        src={anime.gambar}
                        alt={anime.judul}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm line-clamp-2 hover:text-primary-400 transition-colors">
                      <a href={`/anime/${anime.slug}`}>{anime.judul}</a>
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">Latest Episode</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}