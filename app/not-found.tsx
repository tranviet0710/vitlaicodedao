import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | VietDev',
  description: 'The page you are looking for does not exist or has been moved.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center px-4">
        <h1 className="mb-4 text-6xl font-bold text-gray-800 dark:text-gray-100">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">Page Not Found</h2>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
          <Link 
            href="/blogs" 
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Browse Blogs
          </Link>
        </div>
      </div>
    </div>
  )
}
