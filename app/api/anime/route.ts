// app/api/anime/route.ts (updated)
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const search = searchParams.get('search') || ''
  const genre = searchParams.get('genre') || ''
  const type = searchParams.get('type') || ''

  try {
    // Build URL for external API
    const apiUrl = new URL('https://api.ryzumi.vip/api/otakudesu/anime')
    
    if (search) apiUrl.searchParams.append('search', search)
    if (genre) apiUrl.searchParams.append('genre', genre)
    if (type) apiUrl.searchParams.append('type', type)
    apiUrl.searchParams.append('page', page)

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      // Add caching to reduce external API calls
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching anime:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anime data' },
      { status: 500 }
    )
  }
}