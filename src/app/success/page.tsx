'use client'

import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const { clearCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    clearCart() // Clear the cart after successful payment
  }, [clearCart])

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Thank you for your order!
      </h1>
      <p className="text-gray-600 mb-8">
        Your payment was successful and your order is being processed.
      </p>
      <button
        onClick={() => router.push('/products')}
        className="text-green-600 hover:text-green-700"
      >
        Continue Shopping
      </button>
    </div>
  )
}