'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import type { Product, ProductFormData } from '@/types'
import { supabase } from '@/lib/supabase'

interface ProductFormProps {
  product?: Product
  onSubmit: (formData: ProductFormData) => void
  onCancel?: () => void
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    inventory: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)


  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl || '',
        inventory: product.inventory.toString()
      })
      setImagePreview(product.imageUrl)
    }
  }, [product])

  // useEffect(() => {
  //   // Clean up object URL to prevent memory leaks
  //   return () => {
  //     if (imagePreview && !imagePreview.startsWith('http')) {
  //       URL.revokeObjectURL(imagePreview)
  //     }
  //   }
  // }, [imagePreview])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Add validation
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (file: File) => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (error) {
      console.log(`Error uploading file: ${error.message}`)
      throw error
    }
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      let imageUrl = formData.imageUrl
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      onSubmit({
        ...formData,
        imageUrl
      })
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <div className="mt-1 flex items-center">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
            <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                {isUploading ? 'Uploading...' : 'Choose Image'}
            </span>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
                disabled={isUploading}
            />
            </label>
            {formData.imageUrl && (
            <span className="ml-3 text-sm text-gray-500">
                Image selected
            </span>
            )}
        </div>
        {imagePreview && (
            <div className="mt-2">
            <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-lg object-cover"
            />
            </div>
        )}
    </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Inventory</label>
        <input
          type="number"
          value={formData.inventory}
          onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          disabled={isUploading}
        >
          {product ? 'Update' : 'Add'} Product
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}