import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

// Modern sans-serif for body text
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

// Monospace for code and technical elements
const jetBrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// Elegant serif for headings
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

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
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
