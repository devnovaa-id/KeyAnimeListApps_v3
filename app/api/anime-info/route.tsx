// app/api/anime-info/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug parameter is required' },
      { status: 400 }
    )
  }

  try {
    const apiUrl = `https://api.ryzumi.vip/api/otakudesu/anime-info?slug=${slug}`
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
    console.error('Error fetching anime info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anime info' },
      { status: 500 }
    )
  }
}