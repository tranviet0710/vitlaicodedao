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
    <section id="services" className="py-20 md:py-32 bg-background border-t-2 border-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4 text-5xl md:text-6xl font-black uppercase tracking-tighter">
            Services & <span className="text-primary underline decoration-black decoration-4 underline-offset-4">Pricing</span>
          </h2>
          <p className="text-xl font-medium max-w-2xl mx-auto border-2 border-black p-4 bg-white neo-shadow inline-block">
            Các gói dịch vụ phát triển web linh hoạt phù hợp với mọi nhu cầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`p-8 border-2 border-black relative overflow-hidden transition-all duration-300 ${
                service.highlight
                  ? 'bg-primary text-white scale-105 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:scale-105 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {service.highlight && (
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-sm font-bold border-b-2 border-l-2 border-white">
                  POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-3xl font-black mb-2 uppercase ${service.highlight ? 'text-white' : 'text-black'}`}>{service.name}</h3>
                <p className={`text-sm font-medium ${service.highlight ? 'text-white/90' : 'text-gray-600'}`}>{service.description}</p>
              </div>

              <div className="mb-6 border-b-2 border-black pb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-black ${service.highlight ? 'text-white' : 'text-primary'}`}>{service.price}</span>
                  <span className={`font-bold ${service.highlight ? 'text-white/80' : 'text-gray-600'}`}>{service.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 border-2 ${service.highlight ? 'border-white bg-black' : 'border-black bg-primary'}`}>
                        <Check className={`w-3 h-3 ${service.highlight ? 'text-white' : 'text-white'}`} strokeWidth={4} />
                    </div>
                    <span className={`text-sm font-bold ${service.highlight ? 'text-white' : 'text-black'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full border-2 border-black text-lg font-black uppercase tracking-wide neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${
                  service.highlight ? 'bg-white text-black hover:bg-gray-100' : 'bg-primary text-white hover:bg-primary/90'
                }`}
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 stroke-[3px]" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-xl font-bold mb-6">
            Cần giải pháp tùy chỉnh hoặc có câu hỏi về pricing?
          </p>
          <Button variant="outline" size="lg" className="border-2 border-black text-xl font-black px-8 py-6 bg-white hover:bg-accent neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase">
            Contact for Custom Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
