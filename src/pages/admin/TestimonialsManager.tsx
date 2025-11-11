import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  client_avatar: string | null;
  content: string;
  rating: number | null;
  created_at: string | null;
}

const TestimonialsManager = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    client_avatar: '',
    content: '',
    rating: 5,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách testimonials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update({
            client_name: formData.client_name,
            client_role: formData.client_role,
            client_avatar: formData.client_avatar || null,
            content: formData.content,
            rating: formData.rating,
          })
          .eq('id', editingTestimonial.id);

        if (error) throw error;
        toast({ title: 'Cập nhật testimonial thành công!' });
      } else {
        const { error } = await supabase.from('testimonials').insert({
          client_name: formData.client_name,
          client_role: formData.client_role,
          client_avatar: formData.client_avatar || null,
          content: formData.content,
          rating: formData.rating,
        });

        if (error) throw error;
        toast({ title: 'Tạo testimonial thành công!' });
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu testimonial',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      client_name: testimonial.client_name,
      client_role: testimonial.client_role,
      client_avatar: testimonial.client_avatar || '',
      content: testimonial.content,
      rating: testimonial.rating || 5,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa testimonial này?')) return;

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);

      if (error) throw error;
      toast({ title: 'Xóa testimonial thành công!' });
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa testimonial',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({
      client_name: '',
      client_role: '',
      client_avatar: '',
      content: '',
      rating: 5,
    });
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Testimonials</h1>
        <p className="text-foreground/60">Thêm và chỉnh sửa đánh giá khách hàng</p>
      </div>

      {/* Form */}
      <Card className="p-6 mb-8 bg-card border-border/50">
        <h2 className="text-xl font-bold mb-4">
          {editingTestimonial ? 'Chỉnh sửa Testimonial' : 'Tạo Testimonial Mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên khách hàng *</label>
              <Input
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Chức vụ *</label>
              <Input
                value={formData.client_role}
                onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
                placeholder="CEO tại ABC Company"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL Avatar</label>
            <Input
              type="url"
              value={formData.client_avatar}
              onChange={(e) => setFormData({ ...formData, client_avatar: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nội dung đánh giá *</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Đánh giá (sao)</label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-20"
              />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= formData.rating ? 'text-accent fill-accent' : 'text-foreground/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              {editingTestimonial ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            {editingTestimonial && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Hủy
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-6 bg-card border-border/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {testimonial.client_avatar && (
                  <img
                    src={testimonial.client_avatar}
                    alt={testimonial.client_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-bold">{testimonial.client_name}</h3>
                  <p className="text-sm text-foreground/60">{testimonial.client_role}</p>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (testimonial.rating || 0)
                            ? 'text-accent fill-accent'
                            : 'text-foreground/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-foreground/70 italic">"{testimonial.content}"</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManager;
