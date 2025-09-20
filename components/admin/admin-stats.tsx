// components/admin/admin-stats.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', views: 4000 },
  { name: 'Feb', views: 3000 },
  { name: 'Mar', views: 2000 },
  { name: 'Apr', views: 2780 },
  { name: 'May', views: 1890 },
  { name: 'Jun', views: 2390 },
  { name: 'Jul', views: 3490 },
]

export default function AdminStats() {
  return (
    <div className="space-y-6">
      <div className="h-80">
        <h3 className="text-lg font-semibold mb-4">Monthly Views</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-4">Top Anime</h4>
          <div className="space-y-2">
            {['Attack on Titan', 'Demon Slayer', 'Jujutsu Kaisen', 'One Piece', 'My Hero Academia']
              .map((anime, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{anime}</span>
                  <span className="text-muted-foreground">{1000 - index * 200} views</span>
                </div>
              ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-4">User Activity</h4>
          <div className="space-y-2">
            {['New Users', 'Returning Users', 'Watch Parties', 'Messages Sent', 'Friends Added']
              .map((activity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{activity}</span>
                  <span className="text-muted-foreground">{50 - index * 10}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}