// src/lib/supabase-storage.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const BUCKET_NAME = 'products'
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface UploadResult {
  url: string | null
  error: Error | null
}

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ImageUploadError'
  }
}

export const validateImage = (file: File): void => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new ImageUploadError('File must be a JPG, PNG, or WebP image')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ImageUploadError('File size must be less than 5MB')
  }
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  const supabase = createClientComponentClient()
  
  try {
    // Validate the file
    validateImage(file)

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const fileName = `${uniqueId}.${fileExt}`

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file)

    if (uploadError) {
      throw new ImageUploadError(uploadError.message)
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return { url: publicUrl, error: null }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred')
    return { url: null, error }
  }
}