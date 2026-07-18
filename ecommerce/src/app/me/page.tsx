'use client'
import { apiFetch } from "@/lib/fetcher"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User } from "@/types/user"

const Page = () => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const fetchUser = async () => {
    const { ok, data } = await apiFetch('/api/me', { method: 'GET' })
    if (!ok) return
    setUser(data)
  }

  const logoutFunction  = async () => {
    const res = await apiFetch('/api/auth/logout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    })
    if (!res.ok) return
    router.push('/login')
  }

  const deleteAccount = async () => {
    const res = await apiFetch('/api/auth/delete', {
      method: 'DELETE'
    })
    if (!res.ok) return
    router.push('/register')
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 mb-10">
      {user && (
        <>
        <section className="bg-[#5C4033] border border-[#D9CBB8] rounded-lg p-6 shadow-sm mb-6 flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-[#2B211A]">{user.name}</h3>
          <p className="text-sm text-[#2B211A]">{user.email}</p>
          <p className="text-sm text-[#2B211A]">{user.role}</p>

          <span className="text-xs text-[#2B211A] mt-2">Conta criada em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
          <span className="text-xs text-[#2B211A]">Seu id: {user.id}</span>
        </section>

        <section className="flex gap-4">
          <button onClick={() => logoutFunction()}
          className="p-2 rounded-sm text-[#2B211A] text-sm font-medium hover:underline hover:text-[#F5F1E8] hover:bg-[#7A2E2E] transition-colors cursor-pointer">
            Logout
          </button>

          <button onClick={() => deleteAccount()}
          className="p-2 rounded-sm text-[#2B211A] text-sm font-medium hover:underline hover:text-[#F5F1E8] hover:bg-[#7A2E2E] transition-colors cursor-pointer">
            Delete account
          </button>
        </section>
        </>
      )}
    </div>
  )
}

export default Page