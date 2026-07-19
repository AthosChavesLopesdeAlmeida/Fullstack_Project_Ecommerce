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

  const redirect = (id: string) => {
    router.push(`/orders/${id}`)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#2B211A]">Seus pedidos</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {orders.map((order: Order) => (
          <div key={order.id}
          className="bg-[#5C4033] p-4 rounded-lg shadow-lg border border-[#D9CBB8] flex flex-col gap-2"
          onClick={() => redirect(order.id)}>

            <h5 className="text-lg font-bold text-[#F5F1E8] mt-2">{new Date(order.createdAt).toLocaleDateString()}</h5>
            <p className="text-sm text-[#D9CBB8]">{order.status}</p>
            <p className="text-sm text-[#D9CBB8]">{order.total}</p>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Page