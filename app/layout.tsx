import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Viet Dev - Full-Stack Developer & AI Enthusiast',
  description: 'Building innovative web solutions with modern technologies and AI integration',
  keywords: ['Full-Stack Developer', 'AI', 'Web Development', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Viet Dev' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vitlaicodedao.vercel.app',
    title: 'Viet Dev - Full-Stack Developer & AI Enthusiast',
    description: 'Building innovative web solutions with modern technologies and AI integration',
    siteName: 'Viet Dev Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viet Dev - Full-Stack Developer & AI Enthusiast',
    description: 'Building innovative web solutions with modern technologies and AI integration',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
