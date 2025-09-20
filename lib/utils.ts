// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getActualIframeUrl(content: string): Promise<string> {
  try {
    // Step 1: Get nonce
    const nonceResponse = await fetch('https://api.ryzumi.vip/api/otakudesu/nonce');
    if (!nonceResponse.ok) {
      throw new Error('Failed to get nonce');
    }
    const nonceData = await nonceResponse.json();
    const nonce = nonceData.data;

    // Step 2: Get actual iframe URL
    const iframeResponse = await fetch(
      `https://api.ryzumi.vip/api/otakudesu/get-iframe?content=${encodeURIComponent(content)}&nonce=${nonce}`
    );
    if (!iframeResponse.ok) {
      throw new Error('Failed to get iframe URL');
    }
    const iframeData = await iframeResponse.json();
    return iframeData.iframe;
  } catch (error) {
    console.error('Error getting actual iframe URL:', error);
    return '';
  }
}