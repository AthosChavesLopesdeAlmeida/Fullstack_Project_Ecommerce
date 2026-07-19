'use client'
import { Canvas } from "@/generated/prisma/browser"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/fetcher"
import { User } from "@/types/user"

const Page = () => {
  const [canvas, setCanvas] = useState<Canvas | undefined>(undefined)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { id } = useParams<{ id: string }>();

  const fetchCanvas = async () => {
    const { ok, data, status } = await apiFetch(`/api/products/${id}`, { method: 'GET' })

    if (status === 401) {
      router.push('/')
      return
    }

    if (!ok) return
    setCanvas(data)
  }

  const removeItem = async (id: string) => {
    const { ok, status, data } = await apiFetch(`/api/products/${id}`, {
      method: 'DELETE'
    })

    if (status === 401) {
      router.push('/login')
      return
    }

    if (!ok) {
      setError(data?.message || 'Erro ao remover item')
      return
    }

    setError('')
    router.push('/')
  }

  const fetchUser = async () => {
    const { ok, data } = await apiFetch('/api/me', { method: 'GET' })
    if (!ok) return
    setUser(data)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    fetchCanvas()
  }, [])

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


  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 mb-10">
      {canvas && (
        <div className="bg-[#5C4033] border border-[#D9CBB8] rounded-lg p-6 shadow-lg flex flex-col gap-2">
          <Image
            src={canvas.imageUrl}
            alt={canvas.paintingName}
            width={800}
            height={600}
            className="w-full h-auto rounded"
          />

          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#F5F1E8]">{canvas.paintingName}</h3>
            <h5 className="text-sm text-[#D9CBB8]">{canvas.artistName}</h5>
          </div>

          <p className="text-xl font-bold text-[#B08D57] mt-2">US$ {canvas.price.toFixed(2)}</p>

          <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-[#D9CBB8]/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#D9CBB8]">Tamanho</span>
              <span className="text-[#F5F1E8] font-medium">{canvas.size}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#D9CBB8]">Material da moldura</span>
              <span className="text-[#F5F1E8] font-medium">{canvas.frameMaterial}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#D9CBB8]">Estoque</span>
              <span className="text-[#F5F1E8] font-medium">{canvas.stock}</span>
            </div>

            <div className="flex flex-col items-center justify-between text-sm">
              <button className="w-full bg-[#B08D57] text-[#F5F1E8] font-medium rounded-md py-2.5 hover:bg-[#8B5E3C] active:bg-[#5C4033] transition-colors mt-2 shadow-md" onClick={() => addToCart(canvas.id)}>
                Adicionar ao carrinho
              </button>

              {user?.role === 'ADMIN' && (
                <button className="w-full bg-[#7A2E2E] text-[#F5F1E8] font-medium rounded-md py-2.5 hover:bg-[#642525] active:bg-[#5C4033] transition-colors mt-2 shadow-md" onClick={() => removeItem(canvas.id)}>
                  Remover item
                </button>
              )}

              {error && <p className="text-[#7A2E2E] text-sm">{error}</p>}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Page