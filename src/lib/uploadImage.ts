import { writeFile } from 'fs/promises'
import path from 'path'

export async function uploadImage(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`
    const relativePath = `/uploads/products/${uniqueFilename}`
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    // Save the file
    await writeFile(absolutePath, buffer)

    // Return the public URL
    return relativePath
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}