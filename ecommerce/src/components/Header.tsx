'use client'
import { apiFetch } from '@/lib/fetcher'
import { useState, useEffect } from 'react'

type User = { userId: string, name: string, role: string }

export const Header = () => {
  const [user, setUser] = useState<User | null>(null)

  const fetchUser = async () => {
    const { ok, data } = await apiFetch('/api/me', { method: 'GET' })
    if (!ok) return
    setUser(data)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-20 bg-[#5C4033] px-6 py-4 flex items-center justify-between shadow-sm">
      <h2 className="text-xl font-bold tracking-wide text-[#2B211A] flex items-center gap-2">
        <span className="text-[#5865f2]"></span> Canvas shop
      </h2>
      {user && (
        <h2 className="text-xl font-bold tracking-wide text-[#2B211A] flex items-center gap-2">
          Olá, {user.name}!
        </h2>
      )}
    </header>
  )
}

export default Header