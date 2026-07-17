'use client'
import { apiFetch } from "@/lib/fetcher";
import { useState } from 'react'
import { useRouter } from "next/navigation";

const SIZES = ["A5", "A4", "A3", "A2", "A1", "A0"] as const;
const MATERIALS = ["MADEIRA", "MDF", "ALUMINIO"] as const;

type Size = typeof SIZES[number];
type Material = typeof MATERIALS[number];

const Page = () => {
  const [error, setError] = useState('')

  const [artistName, setArtistName] = useState('')
  const [paintingName, setPaintingName] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [size, setSize] = useState<Size | undefined>(undefined)
  const [frameMaterial, setFrameMaterial] = useState<Material | undefined>(undefined)

  const [price, setPrice] = useState<number | null>(null)
  const [stock, setStock] = useState<number | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const res = await apiFetch('/api/products', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({artistName, paintingName, imageUrl, size, frameMaterial, price, stock})
    })
    router.push('/')
    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      return 
    }

    setError('')
    setArtistName('')
    setPaintingName('')
    setImageUrl('')

    setSize(undefined)
    setFrameMaterial(undefined)

    setStock(null)
    setPrice(null)
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-[#5C4033] p-8 rounded-lg shadow-lg border border-[#D9CBB8]">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-[#F5F1E8] mb-2">Crie um produto</h3>
        </div>
        
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 text-left">
          <div>
            <label className="text-xs font-bold text-[#F5F1E8] uppercase tracking-wider block mb-2">Artist name</label>
            <input type="text" onChange={(e) => setArtistName(e.target.value)} placeholder='Artist name'
            className="w-full bg-[#F5F1E8] border border-[#D9CBB8] rounded px-4 py-2.5 text-[#2B211A] placeholder-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Painting name</label>
            <input type="text" onChange={(e) => setPaintingName(e.target.value)} placeholder='Painting name'
            className="w-full bg-[#F5F1E8] border border-[#D9CBB8] rounded px-4 py-2.5 text-[#2B211A] placeholder-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Image URL</label>
            <input type="text" onChange={(e) => setImageUrl(e.target.value)} placeholder='Image URL'
            className="w-full bg-[#F5F1E8] border border-[#D9CBB8] rounded px-4 py-2.5 text-[#2B211A] placeholder-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Price</label>
            <input type="number" onChange={(e) => setPrice(Number(e.target.value))} placeholder='Price'
            className="w-full bg-[#F5F1E8] border border-[#D9CBB8] rounded px-4 py-2.5 text-[#2B211A] placeholder-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Stock</label>
            <input type="number" onChange={(e) => setStock(Number(e.target.value))} placeholder='Stock'
            className="w-full bg-[#F5F1E8] border border-[#D9CBB8] rounded px-4 py-2.5 text-[#2B211A] placeholder-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#F5F1E8] uppercase tracking-wider block mb-2">
              Size
            </label>
            <select
              value={size as string}
              onChange={(e) => setSize(e.target.value as Size)}
              className="w-full bg-[#F5F1E8] border border-[#D9CBB8] rounded px-4 py-2.5 text-[#2B211A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition-all">
              <option value="" disabled>Select the size</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#F5F1E8] uppercase tracking-wider block mb-2">
              Frame material
            </label>
            <select
              value={frameMaterial as string}
              onChange={(e) => setFrameMaterial(e.target.value as Material)}
              className="w-full bg-[#F5F1E8] border border-[#D9CBB8] rounded px-4 py-2.5 text-[#2B211A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition-all">
              <option value="" disabled>Select the frame material</option>
              {MATERIALS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-[#7A2E2E] text-sm">{error}</p>}

          <button type='submit' 
          className="w-full bg-[#B08D57] text-[#F5F1E8] font-medium rounded-md py-3 hover:bg-[#8B5E3C] active:bg-[#5C4033] transition-colors mt-2 shadow-md">
            Create product
          </button>
        </form>
      </div>
    </div>
  )
}

export default Page