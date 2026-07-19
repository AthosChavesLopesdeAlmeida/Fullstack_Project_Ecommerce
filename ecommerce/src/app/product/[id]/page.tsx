'use client'
import { Canvas } from "@/generated/prisma/browser"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/fetcher"

const Page = () => {
  const [canvas, setCanvas] = useState<Canvas | undefined>(undefined)
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

  useEffect(() => {
    fetchCanvas()
  }, [])

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
          </div>
        </div>
      )}
    </div>
  )
}

export default Page