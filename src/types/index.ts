export interface Product {
    id: number
    name: string
    description: string
    price: number
    imageUrl: string | null
    inventory: number
    createdAt: Date
    updatedAt: Date
  }
  
export interface ProductFormData {
  name: string
  description: string
  price: string
  imageUrl: string
  inventory: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  imageUrl?: string | null
}