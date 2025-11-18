import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { blogSchema } from '@/lib/validations';
import { z } from 'zod';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

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

const BlogsManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: true,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách blogs',
        variant: 'destructive',
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
          .from('blogs')
          .update({
            title: validated.title,
            slug: validated.slug,
            excerpt: validated.excerpt || null,
            content: validated.content,
            cover_image: validated.cover_image || null,
            published: validated.published,
          })
          .eq('id', editingBlog.id);

        if (error) throw error;
        toast({ title: 'Cập nhật blog thành công!' });
      } else {
        const { error } = await supabase.from('blogs').insert({
          title: validated.title,
          slug: validated.slug,
          excerpt: validated.excerpt || null,
          content: validated.content,
          cover_image: validated.cover_image || null,
          published: validated.published,
          author_id: user.id,
        });

        if (error) throw error;
        toast({ title: 'Tạo blog thành công!' });
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
          title: 'Validation Error',
          description: 'Please check the form for errors',
          variant: 'destructive',
        });
      } else {
        console.error('Error saving blog:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể lưu blog',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      cover_image: blog.cover_image || '',
      published: blog.published ?? true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa blog này?')) return;

    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);

      if (error) throw error;
      toast({ title: 'Xóa blog thành công!' });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa blog',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      published: true,
    });
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Blogs</h1>
        <p className="text-foreground/60">Tạo và chỉnh sửa bài viết</p>
      </div>

      {/* Form */}
      <Card className="p-6 mb-8 bg-card border-border/50">
        <h2 className="text-xl font-bold mb-4">
          {editingBlog ? 'Chỉnh sửa Blog' : 'Tạo Blog Mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
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

          <div>
            <label className="block text-sm font-medium mb-2">Tóm tắt</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={2}
            />
            {validationErrors.excerpt && (
              <p className="text-sm text-destructive mt-1">{validationErrors.excerpt}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nội dung *</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              required
            />
            {validationErrors.content && (
              <p className="text-sm text-destructive mt-1">{validationErrors.content}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL ảnh bìa</label>
            <Input
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
            />
            {validationErrors.cover_image && (
              <p className="text-sm text-destructive mt-1">{validationErrors.cover_image}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL ảnh bìa</label>
            <Input
              type="url"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Xuất bản
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              {editingBlog ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            {editingBlog && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Hủy
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {blogs.map((blog) => (
          <Card key={blog.id} className="p-6 bg-card border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                <p className="text-sm text-foreground/60 mb-2">{blog.slug}</p>
                <p className="text-foreground/70">{blog.excerpt}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className={`text-sm px-2 py-1 rounded ${blog.published ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {blog.published ? 'Đã xuất bản' : 'Nháp'}
                  </span>
                  <span className="text-sm text-foreground/60">
                    {new Date(blog.created_at || '').toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(blog.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogsManager;
