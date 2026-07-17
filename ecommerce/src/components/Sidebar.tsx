'use client'
import { apiFetch } from "@/lib/fetcher";
import { useState, useEffect } from "react";
import Link from "next/link";

type User = { userId: string; name: string; role: string };
type navLink = { href: string, label: string}

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
    { href: "/me", label: "Minha conta"},
    { href: "/rooms", label: "Salas" },
    { href: "/reservations", label: "Criar reservas" }
  ];

  const adminLinks = [
    { href: "/admin/products", label: "Gerenciar produtos" },
  ];

  return (
    <div>
      <nav className="fixed top-16 left-0 bottom-0 w-56 z-10 overflow-y-auto bg-[#8B5E3C] flex flex-col p-4 gap-1">
        {links.map((link: navLink) => (
          <Link 
          key={link.href}
          href={link.href}
          className="px-3 py-2 rounded text-sm font-medium transition-colors text-[#2B211A] hover:bg-[#B08D57] hover:text-[#F5F1E8]">
            {link.label}
          </Link>
        ))}

        {user.role === 'ADMIN' && (
          <>
            {adminLinks.map((link: navLink) => (
              <Link 
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded text-sm font-medium transition-colors text-[#2B211A] hover:bg-[#B08D57] hover:text-[#F5F1E8]">
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