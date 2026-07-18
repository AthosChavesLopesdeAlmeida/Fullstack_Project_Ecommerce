'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/fetcher'
type User = { userId: string; name: string; role: string };

const Page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)

  const router = useRouter()
  
  const fetchUserName = async () => {
    const { ok, data } = await apiFetch('/api/me', { method: 'GET' })
    if (!ok) return;
    setUser(data)
  }
  
  useEffect(() => {
    fetchUserName()
  }, [])
  
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const submitForm = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')

    const { ok, data } = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    if (!ok) {
      setError(data?.message || 'Erro ao fazer login')
      return 
    }
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-[#5C4033] p-8 rounded-lg shadow-lg border border-[#D9CBB8] text-center">
        <h3 className="text-2xl font-bold text-[#F5F1E8] mb-2">Welcome back!</h3>
        <p className="text-[#2B211A] text-sm mb-6">We are so excited to see you again!</p>
        
        <form onSubmit={(e) => submitForm(e)} className="flex flex-col gap-4 text-left">
          <div>
            <label className="text-xs font-bold text-[#F5F1E8] uppercase tracking-wider block mb-2">Email</label>
            <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder='Type your email'
            className="w-full bg-[#F5F1E8] border border-[#D9CBB8] rounded px-4 py-2.5 text-[#2B211A] placeholder-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#F5F1E8] uppercase tracking-wider block mb-2">Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Type your password'
            className="w-full bg-[#F5F1E8] border border-[#D9CBB8] rounded px-4 py-2.5 text-[#2B211A] placeholder-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition-all"/>
          </div>
          
          <Link href={'/register'} className='text-center m-2'>
            <p className="text-[#F5F1E8] text-sm">Não tem uma conta? crie uma!</p>
          </Link>

          {error && <p className="text-[#7A2E2E] text-sm">{error}</p>}

          <button type='submit' 
          className="w-full bg-[#B08D57] text-[#F5F1E8] font-medium rounded-md py-3 hover:bg-[#8B5E3C] active:bg-[#5C4033] transition-colors mt-2 shadow-md">
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Page