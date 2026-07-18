'use client'
import { apiFetch } from "@/lib/fetcher";
import { useState, useEffect } from "react";
import Link from "next/link";

type User = { userId: string; name: string; role: string };
type NavLink = { href: string, label: string }

export const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const { ok, data } = await apiFetch('/api/me', { method: 'GET' })
    if (ok) setUser(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading || !user) return null;

  const links: NavLink[] = [
    { href: "/", label: "Produtos" },
    { href: "/cart", label: "Carrinho" },
    { href: "/orders", label: "Meus pedidos" },
    { href: "/me", label: "Minha conta" },
  ];

  const adminLinks: NavLink[] = [
    { href: "/admin/products", label: "Gerenciar produtos" },
  ];

  return (
    <nav className="fixed top-16 left-0 bottom-0 w-56 z-10 overflow-y-auto bg-[#8B5E3C] flex flex-col p-4 gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-3 py-2 rounded text-sm font-medium transition-colors text-[#2B211A] hover:bg-[#B08D57] hover:text-[#F5F1E8]">
          {link.label}
        </Link>
      ))}

      {user.role === 'ADMIN' && adminLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-3 py-2 rounded text-sm font-medium transition-colors text-[#2B211A] hover:bg-[#B08D57] hover:text-[#F5F1E8]">
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export default Sidebar