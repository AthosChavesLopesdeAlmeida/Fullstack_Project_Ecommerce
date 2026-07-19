import { Canvas } from "./canvas"

enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  canvasId: string
  canvas: Canvas
}

export interface Order {
  id: string
  status: OrderStatus
  total: number
  createdAt: Date
  items: OrderItem[]
}