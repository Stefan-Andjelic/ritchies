import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`
    const relativePath = `/uploads/products/${uniqueFilename}`
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    // Save the file
    await writeFile(absolutePath, buffer)

    return NextResponse.json({ url: relativePath })
  } catch (error) {
    return NextResponse.json(
      { error: `Error uploading file: ${error}` },
      { status: 500 }
    )
  }
}