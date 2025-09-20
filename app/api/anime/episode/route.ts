// app/api/anime/episode/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const episode = searchParams.get('episode')

  if (!slug || !episode) {
    return NextResponse.json(
      { error: 'Slug and episode parameters are required' },
      { status: 400 }
    )
  }

  try {
    const apiUrl = `https://api.ryzumi.vip/api/otakudesu/anime/episode?slug=${slug}&episode=${episode}`
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching episode data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch episode data' },
      { status: 500 }
    )
  }
}