import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id)
    }
  })
  
  if (!product) {
    notFound()
  }
  
  return product
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  return (
    <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-8">
                        {/* Product Image */}
                        <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                            {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="w-full h-full object-center object-cover"
                            />
                            ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-gray-400">No image available</span>
                            </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="mt-8 text-center">
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <p className="mt-4 text-xl text-green-600">${product.price.toFixed(2)}</p>
                            <p className="mt-4 text-gray-600">{product.description}</p>

                        {/* Add to cart button */}
                        {product.inventory > 0 ? (
                            <button
                            type="button"
                            className="mt-8 w-full max-w-md mx-auto bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700"
                            >
                            Add to Cart
                            </button>
                        ) : (
                            <button
                            type="button"
                            disabled
                            className="mt-8 w-full max-w-md mx-auto bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700"
                            >
                            Out of Stock
                            </button>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}