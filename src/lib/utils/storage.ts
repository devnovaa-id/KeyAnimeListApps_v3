import { supabase } from '@/lib/supabase/client'

interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export const uploadFile = async (file: File, bucket: 'profiles' | 'ads', fileName?: string): Promise<UploadResult> => {
  try {
    const fileExt = file.name.split('.').pop()
    const filePath = fileName || `${Math.random()}.${fileExt}`
    
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)
    
    if (uploadError) {
      throw uploadError
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)
    
    return { success: true, url: publicUrl }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during file upload' 
    }
  }
}

export const deleteFile = async (bucket: 'profiles' | 'ads', filePath: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])
    
    if (error) {
      throw error
    }
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during file deletion' 
    }
  }
}