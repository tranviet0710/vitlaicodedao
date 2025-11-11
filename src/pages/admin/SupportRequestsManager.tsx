import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Calendar, Check, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SupportRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string | null;
}

const SupportRequestsManager = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      let query = supabase
        .from('support_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching support requests:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách yêu cầu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Cập nhật trạng thái thành công!' });
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa yêu cầu này?')) return;

    try {
      const { error } = await supabase.from('support_requests').delete().eq('id', id);

      if (error) throw error;
      toast({ title: 'Xóa yêu cầu thành công!' });
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa yêu cầu',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-accent/10 text-accent';
      case 'in_progress':
        return 'bg-primary/10 text-primary';
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'in_progress':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Yêu cầu Hỗ trợ</h1>
        <p className="text-foreground/60">Xem và xử lý yêu cầu từ người dùng</p>
      </div>

      {/* Filter */}
      <Card className="p-6 mb-8 bg-card border-border/50">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Lọc theo trạng thái:</label>
          <Select value={filterStatus} onValueChange={(value) => {
            setFilterStatus(value);
            setTimeout(fetchRequests, 100);
          }}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="in_progress">Đang xử lý</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card className="p-8 text-center bg-card border-border/50">
            <p className="text-foreground/60">Không có yêu cầu nào</p>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="p-6 bg-card border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{request.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusLabel(request.status)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${request.email}`} className="hover:text-primary">
                        {request.email}
                      </a>
                    </div>
                    {request.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${request.phone}`} className="hover:text-primary">
                          {request.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(request.created_at || '').toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <p className="text-foreground/80 whitespace-pre-wrap">{request.message}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {request.status !== 'in_progress' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(request.id, 'in_progress')}
                  >
                    Đang xử lý
                  </Button>
                )}
                {request.status !== 'completed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(request.id, 'completed')}
                    className="text-green-500 hover:text-green-500"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Hoàn thành
                  </Button>
                )}
                {request.status !== 'cancelled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(request.id, 'cancelled')}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(request.id)}
                  className="text-destructive hover:text-destructive ml-auto"
                >
                  Xóa
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportRequestsManager;
