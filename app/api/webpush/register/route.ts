// app/api/webpush/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json()
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simpan subscription ke database
    const { error } = await supabase
      .from('webpush_subscriptions')
      .upsert({
        user_id: user.id,
        subscription,
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error saving subscription:', error)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in webpush register:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}