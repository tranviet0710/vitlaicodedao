"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Globe, FileText, Save, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { seoSchema } from "@/lib/validations";
import { z } from "zod";

interface SEOSetting {
  id: string;
  page_key: string;
  title: string;
  description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string | null;
  twitter_card: string | null;
  twitter_site: string | null;
  canonical_url: string | null;
}

export default function SEOManagerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SEOSetting[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SEOSetting>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  useEffect(() => {
    const currentSetting = settings.find((s) => s.page_key === selectedPage);
    if (currentSetting) {
      setFormData(currentSetting);
    }
  }, [selectedPage, settings]);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .order("page_key");

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải cài đặt SEO",
        variant: "destructive",
      });
      return;
    }

    setSettings(data || []);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate form data
      const validated = seoSchema.parse({
        ...formData,
        page_key: selectedPage,
      });
      setValidationErrors({});

      const { error } = await supabase.from("seo_settings").upsert({
        page_key: validated.page_key,
        title: validated.title,
        description: validated.description || null,
        keywords: validated.keywords || null,
        og_title: validated.og_title || null,
        og_description: validated.og_description || null,
        og_image: validated.og_image || null,
        og_type: validated.og_type || "website",
        twitter_card: validated.twitter_card || "summary_large_image",
        twitter_site: validated.twitter_site || null,
        canonical_url: validated.canonical_url || null,
      });

      if (error) throw error;

      toast({ title: "Cài đặt SEO đã được lưu thành công" });
      fetchSettings();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationErrors(errors);
        toast({
          title: "Lỗi validation",
          description: "Vui lòng kiểm tra lại form",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể lưu cài đặt SEO",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSitemap = async () => {
    try {
      // Fetch all blogs and projects
      const [blogsRes, projectsRes] = await Promise.all([
        supabase.from("blogs").select("slug, updated_at"),
        supabase.from("projects").select("slug, updated_at"),
      ]);

      const baseUrl = window.location.origin;
      const today = new Date().toISOString().split("T")[0];

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

      // Add blog posts
      blogsRes.data?.forEach((blog) => {
        const lastmod = blog.updated_at
          ? new Date(blog.updated_at).toISOString().split("T")[0]
          : today;
        sitemap += `  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });

      // Add projects
      projectsRes.data?.forEach((project) => {
        const lastmod = project.updated_at
          ? new Date(project.updated_at).toISOString().split("T")[0]
          : today;
        sitemap += `  <url>
    <loc>${baseUrl}/project/${project.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });

      sitemap += `</urlset>`;

      // Download sitemap
      const blob = new Blob([sitemap], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sitemap.xml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: "Sitemap đã được tạo và tải xuống" });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo sitemap",
        variant: "destructive",
      });
    }
  };

  const pages = [
    { key: "home", label: "Home Page" },
    { key: "blog", label: "Blog Page" },
    { key: "projects", label: "Projects Page" },
  ];

  if (authLoading || !user) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              SEO Management
            </h1>
            <p className="text-muted-foreground">
              Manage meta tags and Open Graph settings
            </p>
          </div>
          <Button onClick={generateSitemap} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Generate Sitemap
          </Button>
        </div>

        <Tabs value={selectedPage} onValueChange={setSelectedPage}>
          <TabsList className="grid w-full grid-cols-3">
            {pages.map((page) => (
              <TabsTrigger key={page.key} value={page.key}>
                {page.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {pages.map((page) => (
            <TabsContent key={page.key} value={page.key} className="space-y-6">
              <Card className="p-6 bg-card border-border/50">
                <div className="space-y-6">
                  {/* Basic SEO */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      Basic SEO
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title *</Label>
                      <Input
                        id="title"
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter page title (60 characters max)"
                        maxLength={60}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.title?.length || 0}/60 characters
                      </p>
                      {validationErrors.title && (
                        <p className="text-sm text-destructive">
                          {validationErrors.title}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Meta Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter meta description (160 characters max)"
                        maxLength={160}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.description?.length || 0}/160 characters
                      </p>
                      {validationErrors.description && (
                        <p className="text-sm text-destructive">
                          {validationErrors.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input
                        id="keywords"
                        value={formData.keywords || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, keywords: e.target.value })
                        }
                        placeholder="keyword1, keyword2, keyword3"
                      />
                      {validationErrors.keywords && (
                        <p className="text-sm text-destructive">
                          {validationErrors.keywords}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="canonical">Canonical URL</Label>
                      <Input
                        id="canonical"
                        value={formData.canonical_url || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            canonical_url: e.target.value,
                          })
                        }
                        placeholder="https://vietdev.com"
                      />
                      {validationErrors.canonical_url && (
                        <p className="text-sm text-destructive">
                          {validationErrors.canonical_url}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Open Graph */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Open Graph (Social Sharing)
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="og_title">OG Title</Label>
                      <Input
                        id="og_title"
                        value={formData.og_title || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, og_title: e.target.value })
                        }
                        placeholder="Title for social sharing"
                      />
                      {validationErrors.og_title && (
                        <p className="text-sm text-destructive">
                          {validationErrors.og_title}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_description">OG Description</Label>
                      <Textarea
                        id="og_description"
                        value={formData.og_description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            og_description: e.target.value,
                          })
                        }
                        placeholder="Description for social sharing"
                        rows={3}
                      />
                      {validationErrors.og_description && (
                        <p className="text-sm text-destructive">
                          {validationErrors.og_description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_image">OG Image URL</Label>
                      <Input
                        id="og_image"
                        value={formData.og_image || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, og_image: e.target.value })
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: 1200x630px
                      </p>
                      {validationErrors.og_image && (
                        <p className="text-sm text-destructive">
                          {validationErrors.og_image}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_type">OG Type</Label>
                      <Input
                        id="og_type"
                        value={formData.og_type || "website"}
                        onChange={(e) =>
                          setFormData({ ...formData, og_type: e.target.value })
                        }
                        placeholder="website"
                      />
                      {validationErrors.og_type && (
                        <p className="text-sm text-destructive">
                          {validationErrors.og_type}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Twitter Card */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Twitter Card
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="twitter_card">Twitter Card Type</Label>
                      <Input
                        id="twitter_card"
                        value={formData.twitter_card || "summary_large_image"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            twitter_card: e.target.value,
                          })
                        }
                        placeholder="summary_large_image"
                      />
                      {validationErrors.twitter_card && (
                        <p className="text-sm text-destructive">
                          {validationErrors.twitter_card}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter_site">Twitter Site Handle</Label>
                      <Input
                        id="twitter_site"
                        value={formData.twitter_site || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            twitter_site: e.target.value,
                          })
                        }
                        placeholder="@vietdev"
                      />
                      {validationErrors.twitter_site && (
                        <p className="text-sm text-destructive">
                          {validationErrors.twitter_site}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full gap-2 bg-gradient-primary"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Đang lưu..." : "Lưu cài đặt SEO"}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
