// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getIframeUrl(content: string): Promise<string> {
  try {
    // First get nonce
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
      throw new Error('No nonce data received')
    }
    
    // Then get iframe URL
    const iframeResponse = await fetch(
      `https://api.ryzumi.vip/api/otakudesu/get-iframe?content=${encodeURIComponent(content)}&nonce=${nonceData.data}`,
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
    
    return iframeData.iframe || ''
  } catch (error) {
    console.error('Error getting iframe URL:', error)
    return ''
  }
}