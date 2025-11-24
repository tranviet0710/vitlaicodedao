'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>Welcome to the admin panel</p>
      </div>
    </AdminLayout>
  )
}
