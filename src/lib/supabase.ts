import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Update your upload API route
export async function POST(request: Request) {
    try {
      const formData = await request.formData()
      const file = formData.get('file') as File
      
      const { data, error } = await supabase.storage
        .from('products')
        .upload(`${Date.now()}-${file.name}`, file)
  
      if (error) throw error
  
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(data.path)
  
      return NextResponse.json({ url: publicUrl })
    } catch (error) {
      return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
  }