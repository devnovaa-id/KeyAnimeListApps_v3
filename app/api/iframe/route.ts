// app/api/iframe/route.ts (tambahkan logging)
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const content = searchParams.get('content')

  console.log('Received iframe request with content:', content)

  if (!content) {
    console.error('Content parameter is missing')
    return NextResponse.json(
      { error: 'Content parameter is required' },
      { status: 400 }
    )
  }

  try {
    console.log('Getting nonce from API...')
    // First get nonce from the API
    const nonceResponse = await fetch('https://api.ryzumi.vip/api/otakudesu/nonce', {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!nonceResponse.ok) {
      console.error('Failed to get nonce:', nonceResponse.status, nonceResponse.statusText)
      throw new Error(`Failed to get nonce: ${nonceResponse.status}`)
    }

    const nonceData = await nonceResponse.json()
    console.log('Received nonce:', nonceData)
    
    if (!nonceData.data) {
      console.error('No nonce data in response:', nonceData)
      throw new Error('No nonce data received from API')
    }
    
    // Then get iframe URL using content and nonce
    const iframeUrl = `https://api.ryzumi.vip/api/otakudesu/get-iframe?content=${encodeURIComponent(content)}&nonce=${encodeURIComponent(nonceData.data)}`
    console.log('Requesting iframe from:', iframeUrl)
    
    const iframeResponse = await fetch(iframeUrl, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!iframeResponse.ok) {
      console.error('Failed to get iframe:', iframeResponse.status, iframeResponse.statusText)
      throw new Error(`Failed to get iframe: ${iframeResponse.status}`)
    }

    const iframeData = await iframeResponse.json()
    console.log('Received iframe data:', iframeData)
    
    if (!iframeData.iframe) {
      console.error('No iframe URL in response:', iframeData)
      throw new Error('No iframe URL received from API')
    }
    
    console.log('Returning iframe URL:', iframeData.iframe)
    return NextResponse.json({ iframe: iframeData.iframe })
  } catch (error) {
    console.error('Error getting iframe URL:', error)
    return NextResponse.json(
      { error: 'Failed to get iframe URL from external API' },
      { status: 500 }
    )
  }
}