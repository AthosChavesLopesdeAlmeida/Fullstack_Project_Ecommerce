'use client'
import { apiFetch } from "@/lib/fetcher"
import { useEffect, useState } from "react"
import { Order } from "@/types/order"
import { useRouter, useParams } from "next/navigation"

const Page = () => {
  const [order, setOrder] = useState<Order | undefined>(undefined)
  const { id } = useParams<{ id: string }>();
  const router = useRouter()

  const fetchOrder = async () => {
    const { ok, data, status } = await apiFetch(`/api/orders/${id}`, { method: 'GET' })

    if (status === 401) {
      router.push('/login')
      return
    }

    if (!ok) return
    setOrder(data)
  }

  useEffect(() => {
    fetchOrder()
  }, [])

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#2B211A]">Seu pedido</h2>
      </div>

      {order && (
        <div className="bg-[#5C4033] border border-[#D9CBB8] rounded-lg p-6 shadow-sm mb-6 flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-[#F5F1E8]">{new Date(order.createdAt).toLocaleDateString()}</h3>
          <p className="text-sm text-[#D9CBB8]">{order.status}</p>
          <p className="text-sm text-[#D9CBB8] mb-4">Total: US$ {order.total.toFixed(2)}</p>

          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-[#D9CBB8]/30 py-2">
                <p className="text-[#F5F1E8] font-medium">{item.canvas.paintingName}</p>
                <p className="text-[#F5F1E8]">US$ {item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page