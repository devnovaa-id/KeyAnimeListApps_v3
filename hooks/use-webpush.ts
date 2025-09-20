// hooks/use-webpush.ts
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function useWebPush() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window)

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [supabase])

  useEffect(() => {
    if (isSupported && user) {
      checkSubscription()
    }
  }, [isSupported, user])

  const checkSubscription = async () => {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    setSubscription(sub)
    setIsSubscribed(!!sub)
  }

  const subscribe = async () => {
    if (!isSupported || !user) return

    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })

      // Simpan subscription ke server
      const response = await fetch('/api/webpush/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscription: sub })
      })

      if (response.ok) {
        setSubscription(sub)
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('Error subscribing to push:', error)
    }
  }

  const unsubscribe = async () => {
    if (!subscription) return

    try {
      await subscription.unsubscribe()

      const response = await fetch('/api/webpush/unregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscription })
      })

      if (response.ok) {
        setSubscription(null)
        setIsSubscribed(false)
      }
    } catch (error) {
      console.error('Error unsubscribing from push:', error)
    }
  }

  return {
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe
  }
}