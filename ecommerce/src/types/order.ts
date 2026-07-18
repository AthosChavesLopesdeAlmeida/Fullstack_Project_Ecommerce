enum OrderStatus {
  'PENDING',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELED'
}

export interface Order {
  status: OrderStatus,
  id: string,
  total: number,
  createdAt: Date
}