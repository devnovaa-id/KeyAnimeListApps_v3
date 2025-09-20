// components/watch/watch-chat.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface WatchChatMessage {
  id: string
  user_id: string
  message: string
  created_at: string
  profiles: {
    username: string
    avatar: string | null
  }
}

interface WatchChatProps {
  roomId: string
}

export default function WatchChat({ roomId }: WatchChatProps) {
  const [messages, setMessages] = useState<WatchChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }

    getUser()
  }, [supabase])

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('watch_chat')
        .select(`
          *,
          profiles:user_id (username, avatar)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading messages:', error)
        return
      }

      setMessages(data || [])
    }

    loadMessages()

    // Subscribe to new messages
    const subscription = supabase
      .channel('watch_chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'watch_chat',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as WatchChatMessage])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [roomId, supabase])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !userId) return

    const { error } = await supabase
      .from('watch_chat')
      .insert([
        {
          room_id: roomId,
          user_id: userId,
          message: newMessage.trim(),
        },
      ])

    if (error) {
      console.error('Error sending message:', error)
      return
    }

    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-full border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat Room</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline space-x-2">
                <span className="font-semibold text-sm">
                  {message.profiles.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Ketik pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}