'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/types'
import ProductForm from '@/components/admin/ProductForm'
import { ProductFormData } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    inventory: ''
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }
  
  const handleUpdate = async (formData: ProductFormData) => {
    if (!editingProduct) return
  
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setEditingProduct(null)
        fetchProducts()
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          fetchProducts()
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
        {/* Product Form  */}
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-black mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm 
                product={editingProduct || undefined}
                onSubmit={editingProduct ? handleUpdate : handleSubmit}
                onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
            />
        </div>

        {/* Products Table  */}
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Products</h2>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Inventory</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id}>
                        <td className="px-6 py-4 text-black whitespace-nowrap">{product.name}</td>
                        <td className="px-6 py-4 text-black whitespace-nowrap">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-black whitespace-nowrap">{product.inventory}</td>
                        <td className="px-6 py-4 text-black whitespace-nowrap">
                            <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                            >
                            Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    </div>
  )
}