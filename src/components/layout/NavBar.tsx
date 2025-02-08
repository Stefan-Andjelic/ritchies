'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import CartModal from '@/components/shop/CartModal'

export default function Navbar() {
  const pathname = usePathname()
  const { state } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Don't show navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Ritchie&apos;s
          </Link>

          <div className="flex items-center space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-green-600">
              Shop
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-600 hover:text-green-600"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
            
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </nav>
  )
}