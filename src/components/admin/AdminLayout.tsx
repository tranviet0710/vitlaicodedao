'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Mail, 
  LogOut,
  Menu,
  X,
  Search,
  ScrollText,
  Bell
} from 'lucide-react';
import { useState } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: t('admin.dashboard') },
    { path: '/admin/blogs', icon: FileText, label: t('admin.blogs') },
    { path: '/admin/projects', icon: FolderOpen, label: t('admin.projects') },
    { path: '/admin/testimonials', icon: MessageSquare, label: t('admin.testimonials') },
    { path: '/admin/support-requests', icon: Mail, label: t('admin.supportRequests') },
    { path: '/admin/audit-logs', icon: ScrollText, label: t('admin.auditLogs') },
    { path: '/admin/notifications', icon: Bell, label: t('admin.notifications') },
    { path: '/admin/seo', icon: Search, label: t('admin.seo') },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b-2 border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 border-2 border-border rounded-md neo-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="text-2xl font-black font-heading uppercase tracking-tighter">
                Viet Dev Admin
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:block">
                {user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold"
              >
                <LogOut className="h-4 w-4 mr-2 stroke-[3px]" />
                {t('admin.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-background border-r-2 border-border
            transform transition-transform duration-200 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            mt-[73px] lg:mt-0
          `}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 border-2 transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground border-border neo-shadow -rotate-1 font-bold' 
                      : 'border-transparent hover:border-border hover:bg-accent hover:neo-shadow-sm font-medium'
                    }
                  `}
                >
                  <Icon size={20} className={isActive ? "stroke-[3px]" : ""} />
                  <span className={isActive ? "font-bold" : "font-medium"}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 bg-background/50">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
