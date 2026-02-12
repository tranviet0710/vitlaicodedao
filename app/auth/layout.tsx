import { ReactNode } from 'react'
import { Metadata } from 'next'

// Prevent search engines from indexing auth pages
export const metadata: Metadata = {
  title: 'Đăng nhập | Vịt Lại Code Dạo',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
