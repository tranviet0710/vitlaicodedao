import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Chatbot from "./components/Chatbot";

const queryClient = new QueryClient();

// Lazy load all the page components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const BlogsManager = lazy(() => import("./pages/admin/BlogsManager"));
const ProjectsManager = lazy(() => import("./pages/admin/ProjectsManager"));
const TestimonialsManager = lazy(
  () => import("./pages/admin/TestimonialsManager")
);
const SupportRequestsManager = lazy(
  () => import("./pages/admin/SupportRequestsManager")
);
const AuditLogsViewer = lazy(() => import("./pages/admin/AuditLogsViewer"));
const NotificationSettings = lazy(
  () => import("./pages/admin/NotificationSettings")
);
const SEOManager = lazy(() => import("./pages/admin/SEOManager"));
const NotFound = lazy(() => import("./pages/NotFound"));

const FullPageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <p className="text-lg">Loading...</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<FullPageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/project/:slug" element={<ProjectDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <Dashboard />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <BlogsManager />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <ProjectsManager />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/testimonials"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <TestimonialsManager />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/support-requests"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <SupportRequestsManager />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/audit-logs"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <AuditLogsViewer />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/notifications"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <NotificationSettings />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/seo"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <SEOManager />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Chatbot />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
