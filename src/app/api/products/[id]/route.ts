import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(context.params.id)
      }
    })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching product: ${error}` },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json()
    const product = await prisma.product.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        name: json.name,
        description: json.description,
        price: parseFloat(json.price),
        imageUrl: json.imageUrl,
        inventory: parseInt(json.inventory)
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: `Error updating product: ${error}` },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: {
        id: parseInt(params.id)
      }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: `Error deleting product: ${error}` },
      { status: 500 }
    )
  }
}