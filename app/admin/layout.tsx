import { ReactNode } from 'react'

// Disable static generation for admin routes (requires authentication)
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
