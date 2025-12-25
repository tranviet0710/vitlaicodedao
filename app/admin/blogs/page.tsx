"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { blogSchema } from "@/lib/validations";
import { z } from "zod";
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
} from "@/integrations/supabase/client";

import { ImageUpload } from "@/components/ui/image-upload";
import { useLanguage } from "@/contexts/LanguageContext";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean | null;
  created_at: string | null;
}

export default function BlogsManagerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    published: true,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách blogs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validate form data
    try {
      const validated = blogSchema.parse(formData);
      setValidationErrors({});

      // Proceed with database operation
      if (editingBlog) {
        const { error } = await supabase
          .from("blogs")
          .update({
            title: validated.title,
            slug: validated.slug,
            excerpt: validated.excerpt || null,
            content: validated.content,
            cover_image: validated.cover_image || null,
            published: validated.published,
          })
          .eq("id", editingBlog.id);

        if (error) throw error;
        toast({ title: "Cập nhật blog thành công!" });
      } else {
        const { error } = await supabase.from("blogs").insert({
          title: validated.title,
          slug: validated.slug,
          excerpt: validated.excerpt || null,
          content: validated.content,
          cover_image: validated.cover_image || null,
          published: validated.published,
          author_id: user.id,
        });

        if (error) throw error;
        toast({ title: "Tạo blog thành công!" });
      }

      resetForm();
      fetchBlogs();
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
          title: "Validation Error",
          description: "Please check the form for errors",
          variant: "destructive",
        });
      } else {
        console.error("Error saving blog:", error);
        toast({
          title: "Lỗi",
          description: "Không thể lưu blog",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content,
      cover_image: blog.cover_image || "",
      published: blog.published ?? true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa blog này?")) return;

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Xóa blog thành công!" });
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa blog",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      published: true,
    });
  };

  if (loading || !user) return null;

    if (isLoading) {
    return (
      <AdminLayout>
        <div>{t("admin.loading")}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {t("admin.manageBlogs")}
          </h1>
          <p className="text-foreground/60">{t("admin.blogDesc")}</p>
        </div>

        {/* Form */}
        <Card className="p-6 mb-8 bg-background border-2 border-border neo-shadow">
          <h2 className="text-xl font-bold mb-4">
            {editingBlog ? t("admin.editBlog") : t("admin.createBlog")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.title")} *
                </label>
                <Input
                  className="border-2 border-border"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                {validationErrors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.title}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("admin.slug")} *</label>
                <Input
                  className="border-2 border-border"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
                {validationErrors.slug && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.slug}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t("admin.excerpt")}</label>
              <Textarea
                className="border-2 border-border"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={2}
              />
              {validationErrors.excerpt && (
                <p className="text-sm text-destructive mt-1">
                  {validationErrors.excerpt}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("admin.content")} *
              </label>
              <Textarea
                className="border-2 border-border"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={10}
                required
              />
              {validationErrors.content && (
                <p className="text-sm text-destructive mt-1">
                  {validationErrors.content}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("admin.coverImage")}
              </label>
              <ImageUpload
                value={formData.cover_image}
                onChange={(url) => setFormData({ ...formData, cover_image: url })}
                folder="blogs"
              />
              {validationErrors.cover_image && (
                <p className="text-sm text-destructive mt-1">
                  {validationErrors.cover_image}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-medium">
                {t("admin.published")}
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-primary text-primary-foreground border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all dark:bg-primary dark:text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                {editingBlog ? t("admin.update") : t("admin.create")}
              </Button>
              {editingBlog && (
                <Button type="button" variant="outline" onClick={resetForm} className="bg-background border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  {t("admin.cancel")}
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* List */}
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id} className="p-6 bg-background border-2 border-border neo-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{blog.slug}</p>
                  <p className="text-foreground/80">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span
                      className={`text-sm px-2 py-1 rounded border-2 border-border ${
                        blog.published
                          ? "bg-primary/20 text-primary font-medium"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {blog.published ? t("admin.published") : t("admin.draft")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(blog.created_at || "").toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(blog)}
                    className="border-2 border-border hover:bg-muted"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(blog.id)}
                    className="text-destructive hover:text-destructive border-2 border-border hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
