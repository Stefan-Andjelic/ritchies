'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import type { Product } from '@/types'

interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    imageUrl?: string | null
}

interface CartState {
    items: CartItem[]
    total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
    items: [],
    total: 0
  }

const CartContext = createContext<{
    state: CartState
    addItem: (product: Product) => void
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
} | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
      case 'ADD_ITEM': {
        const existingItem = state.items.find(item => item.id === action.payload.id)
        
        if (existingItem) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === action.payload.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            total: state.total + action.payload.price
          }
        }
  
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          total: state.total + action.payload.price
        }
      }
      
      case 'REMOVE_ITEM': {
        const item = state.items.find(item => item.id === action.payload)
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload),
          total: state.total - (item ? item.price * item.quantity : 0)
        }
      }
  
      case 'UPDATE_QUANTITY': {
        const { id, quantity } = action.payload
        const item = state.items.find(item => item.id === id)
        
        if (!item) return state
        
        const quantityDiff = quantity - item.quantity
        
        return {
          ...state,
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
          total: state.total + (item.price * quantityDiff)
        }
      }
  
      case 'CLEAR_CART':
        return initialState
  
      default:
        return state
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart')
//     if (savedCart) {
//       const parsedCart = JSON.parse(savedCart)
//       parsedCart.items.forEach((item: CartItem) => {
//         dispatch({ type: 'ADD_ITEM', payload: item })
//       })
//     }
//   }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  const addItem = (product: Product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    }
    dispatch({ type: 'ADD_ITEM', payload: cartItem })
  }

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}