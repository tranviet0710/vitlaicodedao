import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BlogDetail from "./pages/BlogDetail";
import ProjectDetail from "./pages/ProjectDetail";
import Dashboard from "./pages/admin/Dashboard";
import BlogsManager from "./pages/admin/BlogsManager";
import ProjectsManager from "./pages/admin/ProjectsManager";
import TestimonialsManager from "./pages/admin/TestimonialsManager";
import SupportRequestsManager from "./pages/admin/SupportRequestsManager";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
