'use client'
import { apiFetch } from "@/lib/fetcher";
import { useState, useEffect } from "react";
import Link from "next/link";

type User = { userId: string; name: string; role: string };
type Link = { href: string, label: string}

export const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const res = await apiFetch('/api/me', {method: 'GET'})
    if (res.ok) {
      const data = await res.json()
      setUser(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading || !user) return null;

  const links = [
    { href: "/", label: "Home" },
    { href: "/rooms", label: "Salas" },
    { href: "/reservations", label: "Criar reservas" },
    { href: "/me", label: "Minha conta"}
  ];

  const adminLinks = [
    { href: "/admin/rooms", label: "Gerenciar salas" },
    { href: "/admin/reservations", label: "Gerenciar reservas" },
  ];

  return (
    <div>
      <nav className="w-56 h-screen bg-[#8B5E3C] border-r border-[#D9CBB8] flex flex-col p-4 gap-1">
        {links.map((link: Link) => (
          <Link 
          key={link.href}
          href={link.href}
          className="px-3 py-2 rounded text-sm font-medium transition-colors text-[#2B211A] hover:bg-[#B08D57] hover:text-[F5F1E8]">
            {link.label}
          </Link>
        ))}

        {user.role === 'ADMIN' && (
          <>
            {adminLinks.map((link: Link) => (
              <Link 
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded text-sm font-medium transition-colors text-[#2B211A] hover:bg-[#B08D57] hover:text-[F5F1E8]">
                {link.label}
              </Link>
            ))}
          </>
        )}
      </nav>
    </div>
  )
}

export default Sidebar