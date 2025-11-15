import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Mail, Save } from 'lucide-react';

const NotificationSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notifyOnSupportRequest, setNotifyOnSupportRequest] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('admin_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setNotifyOnSupportRequest(data.notify_on_support_request);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải cài đặt thông báo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_notification_preferences')
        .upsert({
          user_id: user.id,
          notify_on_support_request: notifyOnSupportRequest,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: 'Đã lưu!',
        description: 'Cài đặt thông báo đã được cập nhật',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu cài đặt thông báo',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Cài đặt Thông báo</h1>
        <p className="text-foreground/60">Quản lý tùy chọn thông báo email của bạn</p>
      </div>

      <Card className="p-6 bg-card border-border/50">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Tùy chọn Email</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <label className="font-medium text-foreground">
                    Yêu cầu hỗ trợ mới
                  </label>
                </div>
                <p className="text-sm text-foreground/60 ml-7">
                  Nhận email khi có yêu cầu hỗ trợ mới từ khách hàng
                </p>
              </div>
              <Switch
                checked={notifyOnSupportRequest}
                onCheckedChange={setNotifyOnSupportRequest}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="min-w-32"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-foreground/70">
              <strong>Lưu ý:</strong> Thông báo sẽ được gửi đến địa chỉ email: <span className="font-mono text-primary">{user?.email}</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationSettings;
