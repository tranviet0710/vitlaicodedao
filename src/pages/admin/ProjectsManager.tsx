import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { projectSchema } from '@/lib/validations';
import { z } from 'zod';

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

const ProjectsManager = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    tech_stack: '',
    thumbnail: '',
    demo_url: '',
    github_url: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    try {
      const validated = projectSchema.parse(formData);
      setValidationErrors({});

      const techStack = validated.tech_stack
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech);

      // Proceed with database operation
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
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
          .eq('id', editingProject.id);

        if (error) throw error;
        toast({ title: 'Cập nhật project thành công!' });
      } else {
        const { error } = await supabase.from('projects').insert({
          title: validated.title,
          slug: validated.slug,
          description: validated.description,
          category: validated.category,
          tech_stack: techStack.length > 0 ? techStack : null,
          thumbnail: validated.thumbnail || null,
          demo_url: validated.demo_url || null,
          github_url: validated.github_url || null,
        });

        if (error) throw error;
        toast({ title: 'Tạo project thành công!' });
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
          title: 'Validation Error',
          description: 'Please check the form for errors',
          variant: 'destructive',
        });
      } else {
        console.error('Error saving project:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể lưu project',
          variant: 'destructive',
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
      tech_stack: project.tech_stack?.join(', ') || '',
      thumbnail: project.thumbnail || '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa project này?')) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;
      toast({ title: 'Xóa project thành công!' });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa project',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      category: '',
      tech_stack: '',
      thumbnail: '',
      demo_url: '',
      github_url: '',
    });
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Projects</h1>
        <p className="text-foreground/60">Thêm và chỉnh sửa dự án</p>
      </div>

      {/* Form */}
      <Card className="p-6 mb-8 bg-card border-border/50">
        <h2 className="text-xl font-bold mb-4">
          {editingProject ? 'Chỉnh sửa Project' : 'Tạo Project Mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên project *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              {validationErrors.title && (
                <p className="text-sm text-destructive mt-1">{validationErrors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
              {validationErrors.slug && (
                <p className="text-sm text-destructive mt-1">{validationErrors.slug}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Danh mục *</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Web, Mobile, etc."
                required
              />
              {validationErrors.category && (
                <p className="text-sm text-destructive mt-1">{validationErrors.category}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tech Stack</label>
              <Input
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                placeholder="React, Node.js, MongoDB (phân cách bằng dấu phẩy)"
              />
              {validationErrors.tech_stack && (
                <p className="text-sm text-destructive mt-1">{validationErrors.tech_stack}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
            {validationErrors.description && (
              <p className="text-sm text-destructive mt-1">{validationErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">URL ảnh</label>
              <Input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              />
              {validationErrors.thumbnail && (
                <p className="text-sm text-destructive mt-1">{validationErrors.thumbnail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Demo URL</label>
              <Input
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              />
              {validationErrors.demo_url && (
                <p className="text-sm text-destructive mt-1">{validationErrors.demo_url}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <Input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
              {validationErrors.github_url && (
                <p className="text-sm text-destructive mt-1">{validationErrors.github_url}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              {editingProject ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            {editingProject && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Hủy
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="p-6 bg-card border-border/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-primary mb-2">{project.category}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(project.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-foreground/70 mb-4">{project.description}</p>
            {project.tech_stack && (
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
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
  );
};

export default ProjectsManager;
