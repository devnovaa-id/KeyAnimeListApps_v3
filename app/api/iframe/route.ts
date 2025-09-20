// app/api/iframe/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const content = searchParams.get('content')

  if (!content) {
    return NextResponse.json(
      { error: 'Content parameter is required' },
      { status: 400 }
    )
  }

  try {
    // 1. Get nonce
    const nonceResponse = await fetch('https://api.ryzumi.vip/api/otakudesu/nonce', {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!nonceResponse.ok) {
      throw new Error(`Failed to get nonce: ${nonceResponse.status}`)
    }

    const nonceData = await nonceResponse.json()
    
    if (!nonceData.data) {
      throw new Error('No nonce data received from API')
    }
    
    // 2. Get iframe URL
    const iframeResponse = await fetch(
      `https://api.ryzumi.vip/api/otakudesu/get-iframe?content=${encodeURIComponent(content)}&nonce=${encodeURIComponent(nonceData.data)}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!iframeResponse.ok) {
      throw new Error(`Failed to get iframe: ${iframeResponse.status}`)
    }

    const iframeData = await iframeResponse.json()
    
    if (!iframeData.iframe) {
      throw new Error('No iframe URL received from API')
    }
    
    return NextResponse.json({ iframe: iframeData.iframe })
  } catch (error) {
    console.error('Error getting iframe URL:', error)
    return NextResponse.json(
      { error: 'Failed to get iframe URL from external API' },
      { status: 500 }
    )
  }
}