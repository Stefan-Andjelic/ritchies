export const dynamic = "force-dynamic";

import { PrismaClient } from '@prisma/client'
import ProductCard from '@/components/shop/ProductCard'

const prisma = new PrismaClient()

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      inventory: {
        gt: 0
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}