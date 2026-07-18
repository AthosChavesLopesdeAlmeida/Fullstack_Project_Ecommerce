'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/fetcher"
import { Order } from "@/types/order"

const Page = () => {
  const [orders, setOrders] = useState<Order[] | []>([])
  const router = useRouter()

  const fetchOrders = async () => {
    const { ok, status, data } = await apiFetch('/api/orders', {method: 'GET'})

    if (status === 401) {
      router.push('/login')
    }

    if (!ok) return
    setOrders(data)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div>
      <div>

      </div>

      <div>
        {orders.map((order: Order) => (
          <div key={order.id}>
            <h4>{new Date(order.createdAt).toLocaleDateString()}</h4>
            <p>{order.status}</p>
            <p>{order.total}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page