import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { FaTelegram, FaFacebookMessenger, FaGithub } from 'react-icons/fa';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { contactSchema } from '@/lib/validations';
import { z } from 'zod';

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    setErrors({});
    setIsSuccess(false);

    try {
      // Validate form data with zod
      const validatedData = contactSchema.parse(formData);
      
      setIsSubmitting(true);

      const { error } = await supabase.from('support_requests').insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message,
        status: 'pending',
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: t('contact.successTitle'),
        description: t('contact.successMessage'),
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: t('contact.errorTitle'),
          description: t('contact.validationError'),
          variant: 'destructive',
        });
      } else {
        console.error('Error submitting form:', error);
        toast({
          title: t('contact.errorTitle'),
          description: t('contact.errorMessage'),
          variant: 'destructive',
        });
      }
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
          <Card className="p-8 bg-card border-border/50 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6">{t('contact.formTitle')}</h3>
            
            {isSuccess && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="text-sm text-foreground">{t('contact.successMessage')}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('contact.name')} *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`bg-background transition-all ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  placeholder={t('contact.namePlaceholder')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('contact.email')} *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`bg-background transition-all ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  placeholder={t('contact.emailPlaceholder')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  {t('contact.phone')}
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  className={`bg-background transition-all ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  placeholder={t('contact.phonePlaceholder')}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('contact.message')} *
                </label>
                <Textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  className={`bg-background resize-none transition-all ${errors.message ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  placeholder={t('contact.messagePlaceholder')}
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">{errors.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.message.length}/5000 {t('contact.characters')}
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-primary group"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('contact.sending') : t('contact.send')}
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
