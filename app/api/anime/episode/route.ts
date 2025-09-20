// app/api/anime/episode/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const episode = searchParams.get('episode')

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug parameter is required' },
      { status: 400 }
    )
  }

  try {
    // Build the API URL
    const apiUrl = new URL('https://api.ryzumi.vip/api/otakudesu/anime/episode')
    apiUrl.searchParams.append('slug', slug)
    if (episode) {
      apiUrl.searchParams.append('episode', episode)
    }

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`)
    }

    const data = await response.json()

    // Check if the response contains error information
    if (data.error) {
      return NextResponse.json(
        { error: data.error },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching episode data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch episode data from external API' },
      { status: 500 }
    )
  }
}