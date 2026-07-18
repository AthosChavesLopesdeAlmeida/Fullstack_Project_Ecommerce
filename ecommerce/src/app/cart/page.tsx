'use client'
import { apiFetch } from "@/lib/fetcher"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Canvas } from "@/types/canvas"

type CartItem = {
  id: string
  quantity: number
  canvasId: string
  canvas: Canvas
}

const Page = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchCart = async () => {
    const { ok, status, data } = await apiFetch('/api/cart', { method: 'GET' })

    if (status === 401) {
      router.push('/login')
      return
    }

    if (!ok) return
    setCart(data)
  }

  const removeFromCart = async (id: string) => {
    const { ok, status, data } = await apiFetch(`/api/cart/${id}`, {
      method: 'DELETE'
    })

    if (status === 401) {
      router.push('/login')
      return
    }

    if (!ok) {
      setError(data?.message || 'Erro ao remover do carrinho')
      return
    }

    setError('')
    fetchCart()
  }

  const confirmPurchase = async () => {
    const { ok, data } = await apiFetch('/api/orders', {
      method: 'POST'
    })

    if (!ok) {
      setError(data?.error || 'Erro ao finalizar compra')
      return
    }

    setError('')
    fetchCart()
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const total = cart.reduce((sum, item) => sum + item.canvas.price * item.quantity, 0)

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#2B211A]">Seu carrinho</h2>
        {cart.length > 0 && (
          <button
            onClick={confirmPurchase}
            className="bg-[#B08D57] text-[#F5F1E8] font-medium rounded-md px-6 py-2.5 hover:bg-[#8B5E3C] active:bg-[#5C4033] transition-colors mt-4 shadow-md">
            Confirmar compra (R$ {total.toFixed(2)})
          </button>
        )}
        {error && <p className="text-[#7A2E2E] text-sm mt-2">{error}</p>}
      </div>

      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-[#5C4033] p-4 rounded-lg shadow-lg border border-[#D9CBB8] flex items-center justify-between gap-4">
            <div>
              <h5 className="text-lg font-bold text-[#F5F1E8]">{item.canvas.paintingName}</h5>
              <p className="text-sm text-[#D9CBB8]">Preço: R$ {item.canvas.price.toFixed(2)}</p>
              <p className="text-sm text-[#D9CBB8]">Estoque: {item.canvas.stock}</p>
              <p className="text-sm text-[#D9CBB8]">Quantidade: {item.quantity}</p>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-[#7A2E2E] text-[#F5F1E8] font-medium rounded-md px-6 py-2.5 hover:bg-[#8B5E3C] active:bg-[#5C4033] transition-colors shadow-md">
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page