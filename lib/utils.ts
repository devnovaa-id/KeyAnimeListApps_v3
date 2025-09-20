// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getIframeUrl(content: string): Promise<string> {
  try {
    console.log('Getting iframe URL for content:', content)
    
    // First get nonce from the API
    const nonceResponse = await fetch('https://api.ryzumi.vip/api/otakudesu/nonce', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!nonceResponse.ok) {
      throw new Error(`Failed to get nonce: ${nonceResponse.status} ${nonceResponse.statusText}`)
    }

    const nonceData = await nonceResponse.json()
    console.log('Received nonce:', nonceData)
    
    if (!nonceData.data) {
      throw new Error('No nonce data received from API')
    }
    
    // Then get iframe URL using content and nonce
    const iframeResponse = await fetch(
      `https://api.ryzumi.vip/api/otakudesu/get-iframe?content=${encodeURIComponent(content)}&nonce=${encodeURIComponent(nonceData.data)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!iframeResponse.ok) {
      throw new Error(`Failed to get iframe: ${iframeResponse.status} ${iframeResponse.statusText}`)
    }

    const iframeData = await iframeResponse.json()
    console.log('Received iframe data:', iframeData)
    
    if (!iframeData.iframe) {
      throw new Error('No iframe URL received from API')
    }
    
    return iframeData.iframe
  } catch (error) {
    console.error('Error getting iframe URL:', error)
    return ''
  }
}