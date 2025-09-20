// components/watch/watch-users.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User, Users } from 'lucide-react'

interface OnlineUser {
  id: string
  username: string
  avatar: string | null
}

interface WatchUsersProps {
  roomId: string
}

export default function WatchUsers({ roomId }: WatchUsersProps) {
  const [users, setUsers] = useState<OnlineUser[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    // This is a simplified implementation
    // In a real app, you'd use Supabase Presence or a more robust system
    const fetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get users who have sent messages in this room recently
      const { data, error } = await supabase
        .from('watch_chat')
        .select(`
          user_id,
          profiles:user_id (username, avatar)
        `)
        .eq('room_id', roomId)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        return
      }

      // Remove duplicates
      const uniqueUsers = data.reduce((acc: OnlineUser[], item: any) => {
        if (!acc.find(u => u.id === item.user_id)) {
          acc.push({
            id: item.user_id,
            username: item.profiles.username,
            avatar: item.profiles.avatar
          })
        }
        return acc
      }, [])

      setUsers(uniqueUsers)
    }

    fetchUsers()

    const interval = setInterval(fetchUsers, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [roomId, supabase])

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5" />
        <h3 className="font-semibold">Online ({users.length})</h3>
      </div>
      
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
              <User className="h-3 w-3" />
            </div>
            <span className="text-sm">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  )
}