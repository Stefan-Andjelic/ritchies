export const dynamic = "force-dynamic";

import { PrismaClient } from '@prisma/client'
import ProductCard from '@/components/shop/ProductCard'

const prisma = new PrismaClient()

async function getProducts() {
  const products = await prisma.product.findMany({
    take: 4, // Only get 4 products for the homepage
    where: {
      inventory: {
        gt: 0
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return products
}

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gray-50 mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Handcrafted with Love
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-500">
            Experience the finest natural skincare products made with farm-fresh ingredients. 
            From body lotions to lip balms, each product is crafted with care.
          </p>
          <div className="mt-10">
            
            <a  href="/shop"
              className="inline-block rounded-md border border-transparent bg-green-600 px-8 py-3 text-center font-medium text-white hover:bg-green-700"
            >
              Shop All Products
            </a>
          </div>
        </div>
      </div>

      {/* Featured Products section */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Products</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No products available yet. Check back soon!
          </p>
        )}
        
        {products.length > 0 && (
          <div className="mt-12 text-center">
            
            <a  href="/shop"
              className="text-green-600 hover:text-green-500 font-medium"
            >
              View all products →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
