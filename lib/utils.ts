// lib/utils.ts
export async function getIframeUrl(content: string): Promise<string> {
  try {
    // First get nonce
    const nonceResponse = await fetch('https://api.ryzumi.vip/api/otakudesu/nonce')
    const nonceData = await nonceResponse.json()
    
    if (!nonceData.data) {
      throw new Error('Failed to get nonce')
    }
    
    // Then get iframe URL
    const iframeResponse = await fetch(
      `https://api.ryzumi.vip/api/otakudesu/get-iframe?content=${encodeURIComponent(content)}&nonce=${nonceData.data}`
    )
    const iframeData = await iframeResponse.json()
    
    return iframeData.iframe || ''
  } catch (error) {
    console.error('Error getting iframe URL:', error)
    return ''
  }
}