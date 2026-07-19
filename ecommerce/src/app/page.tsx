'use client'
import { apiFetch } from "@/lib/fetcher"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Canvas } from "@/types/canvas"
import Image from "next/image"

const Page = () => {
  const [canvas, setCanvas] = useState<Canvas[] | []>([])
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchProducts = async () => {
    const { ok, status, data } = await apiFetch('/api/products', { method: 'GET' })

    if (status === 401) {
      router.push('/login')
      return
    }

    if (!ok) return
    setCanvas(data)
  }

  const redirect = (id: string) => {
    router.push(`/product/${id}`)
  }

  const addToCart = async (canvasId: string) => {
    const { ok, status, data } = await apiFetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({canvasId, quantity: 1})
    })

    if (status === 401) {
      router.push('/login')
      return
    }

    if (!ok) {
      setError(data?.message || 'Erro ao adicionar ao carrinho')
      return
    }

    setError('')
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#2B211A]">Nossos produtos</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {canvas.map((canvas: Canvas) => (
          <div
            key={canvas.id}
            className="bg-[#5C4033] p-4 rounded-lg shadow-lg border border-[#D9CBB8] flex flex-col gap-2"
            onClick={() => redirect(canvas.id)}>
            <Image
              src={canvas.imageUrl}
              alt={canvas.paintingName}
              width={400}
              height={300}
              className="w-full h-56 object-cover rounded"
            />

            <h5 className="text-lg font-bold text-[#F5F1E8] mt-2">{canvas.paintingName}</h5>
            <p className="text-sm text-[#D9CBB8]">{canvas.artistName}</p>

            <button
              onClick={() => addToCart(canvas.id)}
              className="w-full bg-[#B08D57] text-[#F5F1E8] font-medium rounded-md py-2.5 hover:bg-[#8B5E3C] active:bg-[#5C4033] transition-colors mt-2 shadow-md"
            >
              Adicionar ao carrinho
            </button>

            {error && <p className="text-[#7A2E2E] text-sm">{error}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page