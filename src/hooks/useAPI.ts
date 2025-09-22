'use client'

import { useState, useCallback } from 'react'

interface UseAPIOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export const useAPI = (options?: UseAPIOptions) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<any>(null)

  const execute = useCallback(async (promise: Promise<any>) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await promise
      setData(result)
      options?.onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred')
      setError(error)
      options?.onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [options])

  return { execute, loading, error, data }
}