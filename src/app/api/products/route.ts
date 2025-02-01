import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching products: ${error}` },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const product = await prisma.product.create({
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
      { error: `Error creating product: ${error}` },
      { status: 500 }
    )
  }
}