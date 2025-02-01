'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div className="relative"> {/* Add relative positioning here */}
          <h3 className="text-sm text-gray-700">
            <Link href={`/products/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.description}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault() // Add this to prevent any potential event bubbling
          addItem(product)
        }}
        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        Add to Cart
      </button>
    </div>
  )
}