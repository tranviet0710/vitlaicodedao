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
import { projectSchema } from "@/lib/validations";
import { z } from "zod";
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
} from "@/integrations/supabase/client";

import { useLanguage } from "@/contexts/LanguageContext";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tech_stack: string[] | null;
  thumbnail: string | null;
  demo_url: string | null;
  github_url: string | null;
  created_at: string | null;
}

export default function ProjectsManagerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    tech_stack: "",
    thumbnail: "",
    demo_url: "",
    github_url: "",
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
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ingestProjectToRAG = async (projectData: Project) => {
    try {
      const fullContent = `Project Title: ${projectData.title}. Category: ${
        projectData.category
      }. Tech Stack: ${
        projectData.tech_stack?.join(", ") || ""
      }. Description: ${projectData.description}`;
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/ingest-document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            text: fullContent,
            metadata: {
              source: "project",
              id: projectData.id,
              slug: projectData.slug,
              title: projectData.title,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to ingest project to RAG");
      }

      toast({ title: "Project ingested to RAG successfully!" });
    } catch (error: unknown) {
      console.error("Error ingesting project to RAG:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Lỗi RAG",
        description: `Không thể ingest project vào RAG: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    try {
      const validated = projectSchema.parse(formData);
      setValidationErrors({});

      const techStack = validated.tech_stack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech);

      let projectId = editingProject?.id;

      // Proceed with database operation
      if (editingProject) {
        const { data, error } = await supabase
          .from("projects")
          .update({
            title: validated.title,
            slug: validated.slug,
            description: validated.description,
            category: validated.category,
            tech_stack: techStack.length > 0 ? techStack : null,
            thumbnail: validated.thumbnail || null,
            demo_url: validated.demo_url || null,
            github_url: validated.github_url || null,
          })
          .eq("id", editingProject.id)
          .select()
          .single();

        if (error) throw error;
        toast({ title: "Cập nhật project thành công!" });
        projectId = data.id;
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert({
            title: validated.title,
            slug: validated.slug,
            description: validated.description,
            category: validated.category,
            tech_stack: techStack.length > 0 ? techStack : null,
            thumbnail: validated.thumbnail || null,
            demo_url: validated.demo_url || null,
            github_url: validated.github_url || null,
          })
          .select()
          .single();

        if (error) throw error;
        toast({ title: "Tạo project thành công!" });
        projectId = data.id;
      }

      // After successful save, ingest to RAG
      if (projectId) {
        const { data: newProjectData, error: fetchError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (fetchError) {
          console.error(
            "Error fetching new project for RAG ingestion:",
            fetchError
          );
          toast({
            title: "Lỗi",
            description: "Không thể lấy thông tin project để ingest vào RAG",
            variant: "destructive",
          });
        } else if (newProjectData) {
          await ingestProjectToRAG(newProjectData);
        }
      }

      resetForm();
      fetchProjects();
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
        console.error("Error saving project:", error);
        toast({
          title: "Lỗi",
          description: "Không thể lưu project",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      category: project.category,
      tech_stack: project.tech_stack?.join(", ") || "",
      thumbnail: project.thumbnail || "",
      demo_url: project.demo_url || "",
      github_url: project.github_url || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa project này?")) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Xóa project thành công!" });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa project",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      category: "",
      tech_stack: "",
      thumbnail: "",
      demo_url: "",
      github_url: "",
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
            {t("admin.manageProjects")}
          </h1>
          <p className="text-foreground/60">{t("admin.projectDesc")}</p>
        </div>

        {/* Form */}
        <Card className="p-6 mb-8 bg-background border-2 border-border neo-shadow">
          <h2 className="text-xl font-bold mb-4">
            {editingProject ? t("admin.editProject") : t("admin.createProject")}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.category")} *
                </label>
                <Input
                  className="border-2 border-border"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Web, Mobile, etc."
                  required
                />
                {validationErrors.category && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.category}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.techStack")}
                </label>
                <Input
                  className="border-2 border-border"
                  value={formData.tech_stack}
                  onChange={(e) =>
                    setFormData({ ...formData, tech_stack: e.target.value })
                  }
                  placeholder="React, Node.js, MongoDB (phân cách bằng dấu phẩy)"
                />
                {validationErrors.tech_stack && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.tech_stack}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t("admin.description")} *</label>
              <Textarea
                className="border-2 border-border"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
              />
              {validationErrors.description && (
                <p className="text-sm text-destructive mt-1">
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.thumbnail")}
                </label>
                <Input
                  className="border-2 border-border"
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                />
                {validationErrors.thumbnail && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.thumbnail}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.demoUrl")}
                </label>
                <Input
                  className="border-2 border-border"
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, demo_url: e.target.value })
                  }
                />
                {validationErrors.demo_url && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.demo_url}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.githubUrl")}
                </label>
                <Input
                  className="border-2 border-border"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                />
                {validationErrors.github_url && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.github_url}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-primary text-primary-foreground border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <Plus className="mr-2 h-4 w-4" />
                {editingProject ? t("admin.update") : t("admin.create")}
              </Button>
              {editingProject && (
                <Button type="button" variant="outline" onClick={resetForm} className="bg-background border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  {t("admin.cancel")}
                </Button>
              )}
            </div>
          </form>
        </Card>


        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="p-6 bg-background border-2 border-border neo-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-primary font-medium mb-2">
                    {project.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    className="border-2 border-border hover:bg-muted"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(project.id)}
                    className="text-destructive hover:text-destructive border-2 border-border hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              {project.tech_stack && (
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary/20 text-primary border-2 border-border rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
