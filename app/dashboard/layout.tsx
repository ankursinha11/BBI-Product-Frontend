import { Space_Grotesk } from 'next/font/google'
import { Sidebar } from './components/sidebar'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${spaceGrotesk.variable} flex min-h-screen bg-gradient-to-br from-[#000B2E] via-[#001959] to-[#000B2E]`}>
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

