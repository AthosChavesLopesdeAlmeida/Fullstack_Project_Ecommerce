import './globals.css'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="flex bg-[#F5F1E8] text-[#2B211A] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}