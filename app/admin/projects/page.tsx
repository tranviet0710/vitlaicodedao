'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/components/admin/AdminLayout'

export default function ProjectsManagerPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading || !user) return null

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Projects Manager</h1>
        <p>Manage your projects here</p>
      </div>
    </AdminLayout>
  )
}
