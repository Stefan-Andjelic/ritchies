'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { uploadImage, ImageUploadError, validateImage } from '@/lib/supabase-storage'
import type { Product, ProductFormData } from '@/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface ProductFormProps {
  product?: Product
  onSubmit: (formData: ProductFormData) => Promise<void>
  onCancel?: () => void
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    imageUrl: product?.imageUrl || '',
    inventory: product?.inventory || 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Set initial image preview if product has an image
    if (product?.imageUrl) {
      setImagePreview(product.imageUrl)
    }
  }, [product])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      validateImage(file)
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError(null)
    } catch (err) {
      if (err instanceof ImageUploadError) {
        setError(err.message)
      }
      e.target.value = '' // Reset file input
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)
    setError(null)

    try {
      let imageUrl = formData.imageUrl

      if (imageFile) {
        const { url, error } = await uploadImage(imageFile)
        if (error) throw error
        if (!url) throw new Error('Failed to get image URL')
        imageUrl = url
      }

      await onSubmit({
        ...formData,
        imageUrl,
      })

      // Reset form if it's a new product
      if (!product) {
        setFormData({
          name: '',
          description: '',
          price: 0,
          imageUrl: '',
          inventory: 0,
        })
        setImageFile(null)
        setImagePreview(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setIsUploading(false)
    }
  }

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      {/* Price Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      {/* Image Upload Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <div className="mt-1 flex items-center space-x-4">
          <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
            <input
              type="file"
              className="sr-only"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={isUploading}
            />
          </label>
          {imagePreview && (
            <div className="relative h-20 w-20">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="rounded object-cover"
              />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
      
      {/* Inventory Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Inventory</label>
        <input
          type="number"
          value={formData.inventory}
          onChange={(e) => setFormData({ ...formData, inventory: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isUploading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}