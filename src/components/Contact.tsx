import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { FaTelegram, FaFacebookMessenger } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'your.email@example.com',
      link: 'mailto:your.email@example.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+84 123 456 789',
      link: 'tel:+84123456789',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Ho Chi Minh City, Vietnam',
      link: '#',
    },
  ];

  const socialLinks = [
    {
      icon: SiZalo,
      name: 'Zalo',
      link: 'https://zalo.me/your-number',
      color: 'hover:text-[#0068FF]',
    },
    {
      icon: FaTelegram,
      name: 'Telegram',
      link: 'https://t.me/yourusername',
      color: 'hover:text-[#0088cc]',
    },
    {
      icon: FaFacebookMessenger,
      name: 'Messenger',
      link: 'https://m.me/yourpage',
      color: 'hover:text-[#0084FF]',
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Có project mới hoặc muốn trao đổi? Hãy liên hệ ngay!
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
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
              <h3 className="text-2xl font-bold mb-6">Chat với tôi</h3>
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
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tên của bạn</label>
                <Input placeholder="Nguyễn Văn A" className="bg-background" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="email@example.com" className="bg-background" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dự án của bạn</label>
                <Input placeholder="Website E-commerce" className="bg-background" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mô tả chi tiết</label>
                <Textarea
                  placeholder="Mô tả project, budget, timeline..."
                  className="bg-background min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-primary" size="lg">
                <Send className="mr-2 w-5 h-5" />
                Gửi yêu cầu
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
