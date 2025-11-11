import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FileText, FolderOpen, MessageSquare, Mail } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    testimonials: 0,
    supportRequests: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [blogs, projects, testimonials, supportRequests] = await Promise.all([
      supabase.from('blogs').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      supabase.from('support_requests').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      blogs: blogs.count || 0,
      projects: projects.count || 0,
      testimonials: testimonials.count || 0,
      supportRequests: supportRequests.count || 0,
    });
  };

  const statCards = [
    {
      title: 'Blogs',
      count: stats.blogs,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Projects',
      count: stats.projects,
      icon: FolderOpen,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Testimonials',
      count: stats.testimonials,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Yêu cầu hỗ trợ',
      count: stats.supportRequests,
      icon: Mail,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-foreground/60">Tổng quan quản lý nội dung</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 bg-card border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.count}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
