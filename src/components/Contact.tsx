import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { FaTelegram, FaFacebookMessenger, FaGithub } from 'react-icons/fa';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'tranviet0710@gmail.com',
      link: 'mailto:tranviet0710@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '0935169835',
      link: 'tel:0935169835',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Hanoi, Vietnam',
      link: '#',
    },
  ];

  const socialLinks = [
    {
      icon: FaTelegram,
      name: 'Telegram',
      link: 'https://t.me/pikapika2101',
      color: 'hover:text-[#0088cc]',
    },
    {
      icon: FaFacebookMessenger,
      name: 'Facebook',
      link: 'https://facebook.com/tranviet0710',
      color: 'hover:text-[#0084FF]',
    },
    {
      icon: FaGithub,
      name: 'GitHub',
      link: 'https://github.com/tranviet0710',
      color: 'hover:text-primary',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('support_requests').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: 'Gửi thành công!',
        description: 'Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.',
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể gửi yêu cầu. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4">
            Cần Hỗ Trợ <span className="gradient-text">Lập Trình?</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Bạn cần hỗ trợ phát triển website, app, hoặc tư vấn kỹ thuật? Hãy liên hệ ngay!
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Thông tin liên hệ</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.link}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-card/80 transition-all duration-300 border border-border/50 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">{method.title}</p>
                        <p className="font-semibold">{method.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Kết nối với tôi</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-14 h-14 rounded-full bg-card border-2 border-border/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary ${social.color}`}
                      title={social.name}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8 bg-card border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên của bạn <span className="text-destructive">*</span>
                </label>
                <Input 
                  placeholder="Nguyễn Văn A" 
                  className="bg-background"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input 
                  type="email" 
                  placeholder="email@example.com" 
                  className="bg-background"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Số điện thoại
                </label>
                <Input 
                  type="tel"
                  placeholder="0912345678" 
                  className="bg-background"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mô tả yêu cầu <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Mô tả chi tiết về dự án, yêu cầu kỹ thuật, timeline mong muốn..."
                  className="bg-background min-h-[120px]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary" 
                size="lg"
                disabled={isSubmitting}
              >
                <Send className="mr-2 w-5 h-5" />
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
