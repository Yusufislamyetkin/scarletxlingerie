import type { Metadata } from 'next'
import AdminSidebar from './AdminSidebar'

export const metadata: Metadata = {
  title: { default: 'Admin Panel', template: '%s — ScarletX Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <AdminSidebar />
      {/* İçerik alanı: sidebar genişliği kadar sol margin */}
      <div className="ml-64">
        <main className="min-h-screen p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
