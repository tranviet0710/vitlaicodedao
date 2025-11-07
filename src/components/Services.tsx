import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      name: 'Starter Package',
      price: '15,000,000',
      period: 'VNĐ',
      description: 'Phù hợp cho startup và dự án nhỏ',
      features: [
        'Landing page hoặc portfolio website',
        'Responsive design (mobile, tablet, desktop)',
        'Basic SEO optimization',
        'Contact form integration',
        '3 lần revision',
        '1 tháng support sau launch',
      ],
      highlight: false,
    },
    {
      name: 'Professional',
      price: '35,000,000',
      period: 'VNĐ',
      description: 'Giải pháp toàn diện cho doanh nghiệp',
      features: [
        'Full-stack web application',
        'User authentication & authorization',
        'Database design & implementation',
        'Admin dashboard',
        'API integration',
        'Advanced SEO & performance',
        '5 lần revision',
        '3 tháng support & maintenance',
      ],
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Quote',
      description: 'Giải pháp tùy chỉnh cho doanh nghiệp lớn',
      features: [
        'Complex web/mobile applications',
        'Microservices architecture',
        'Cloud infrastructure setup (AWS/GCP)',
        'CI/CD pipeline',
        'Real-time features',
        'Advanced analytics & monitoring',
        'Unlimited revisions',
        '6 tháng support & scaling',
        'Team training & documentation',
      ],
      highlight: false,
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4">
            Services & <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Các gói dịch vụ phát triển web linh hoạt phù hợp với mọi nhu cầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`p-8 bg-card border-border/50 relative overflow-hidden transition-all duration-300 ${
                service.highlight
                  ? 'border-2 border-primary shadow-glow scale-105'
                  : 'hover:scale-105'
              }`}
            >
              {service.highlight && (
                <div className="absolute top-0 right-0 bg-gradient-primary text-background px-4 py-1 text-sm font-bold">
                  POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <p className="text-foreground/60 text-sm">{service.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold gradient-text">{service.price}</span>
                  <span className="text-foreground/60">{service.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  service.highlight ? 'bg-gradient-primary' : 'bg-secondary hover:bg-secondary/80'
                }`}
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-foreground/70 mb-4">
            Cần giải pháp tùy chỉnh hoặc có câu hỏi về pricing?
          </p>
          <Button variant="outline" size="lg" className="border-2 border-primary hover:bg-primary/10">
            Contact for Custom Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
