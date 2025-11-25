'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { FileText, FolderOpen, MessageSquare, Mail, TrendingUp, Users, Eye } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    testimonials: 0,
    supportRequests: 0,
  })
  const [recentActivity, setRecentActivity] = useState<{ type: string; title: string; date: string }[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchStats()
      fetchRecentActivity()
    }
  }, [user])

  const fetchStats = async () => {
    const [blogs, projects, testimonials, supportRequests] = await Promise.all([
      supabase.from('blogs').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      supabase.from('support_requests').select('id', { count: 'exact', head: true }),
    ])

    setStats({
      blogs: blogs.count || 0,
      projects: projects.count || 0,
      testimonials: testimonials.count || 0,
      supportRequests: supportRequests.count || 0,
    })
  }

  const fetchRecentActivity = async () => {
    const { data: recentBlogs } = await supabase
      .from('blogs')
      .select('title, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentProjects } = await supabase
      .from('projects')
      .select('title, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    const activities = [
      ...(recentBlogs?.map(b => ({ type: 'blog', title: b.title, date: b.created_at })) || []),
      ...(recentProjects?.map(p => ({ type: 'project', title: p.title, date: p.created_at })) || []),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

    setRecentActivity(activities)
  }

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

  const statCards = [
    {
      title: 'Blogs',
      count: stats.blogs,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
    },
    {
      title: 'Projects',
      count: stats.projects,
      icon: FolderOpen,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '+8%',
    },
    {
      title: 'Testimonials',
      count: stats.testimonials,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+15%',
    },
    {
      title: 'Yêu cầu hỗ trợ',
      count: stats.supportRequests,
      icon: Mail,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '+5%',
    },
  ]

  // Mock data for charts
  const lineChartData = [
    { name: 'Jan', blogs: 4, projects: 2 },
    { name: 'Feb', blogs: 3, projects: 3 },
    { name: 'Mar', blogs: 5, projects: 2 },
    { name: 'Apr', blogs: 7, projects: 4 },
    { name: 'May', blogs: 6, projects: 3 },
    { name: 'Jun', blogs: 8, projects: 5 },
  ]

  const pieChartData = [
    { name: 'Blogs', value: stats.blogs },
    { name: 'Projects', value: stats.projects },
    { name: 'Testimonials', value: stats.testimonials },
  ]

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))']

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan quản lý nội dung</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card 
                key={stat.title} 
                className="p-6 bg-card border-border/50 hover:shadow-glow transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-primary flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.count}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <Card className="p-6 bg-card border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Xu hướng nội dung
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="blogs" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="projects" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart */}
          <Card className="p-6 bg-card border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Phân bổ nội dung
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 bg-card border-border/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm">Chưa có hoạt động nào</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {activity.type === 'blog' ? (
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <FolderOpen className="w-5 h-5 text-accent flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.type === 'blog' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                  }`}>
                    {activity.type === 'blog' ? 'Blog' : 'Project'}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
