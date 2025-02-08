import { supabase } from './supabase'

const uploadImage = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    
    console.log('Attempting to upload:', fileName) // Debug log
    
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (error) {
      console.error('Supabase upload error:', error) // More detailed error
      throw error
    }

    console.log('Upload successful:', data) // Debug log

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (err) {
    console.error('Full upload error:', err) // Full error object
    throw err
  }
}