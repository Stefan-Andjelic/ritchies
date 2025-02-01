'use client'

import { useCart } from '@/context/CartContext'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    onClose()  // Close the modal first
    router.push('/checkout')  // Then navigate to checkout
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="text-sm border rounded-md"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-sm text-red-600 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-4">
            {state.items.length > 0 && (
              <>
                <div className="flex justify-between text-base font-medium">
                  <p>Total</p>
                  <p>${state.total.toFixed(2)}</p>
                </div>
                <button
                  onClick={clearCart}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Clear Cart
                </button>
                <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                    Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}