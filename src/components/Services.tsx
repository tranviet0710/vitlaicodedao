import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      name: t('services.frontend.name'),
      price: t('services.frontend.price'),
      period: t('services.frontend.period'),
      description: t('services.frontend.description'),
      features: [
        t('services.frontend.f1'),
        t('services.frontend.f2'),
        t('services.frontend.f3'),
      ],
      highlight: false,
    },
    {
      name: t('services.backend.name'),
      price: t('services.backend.price'),
      period: t('services.backend.period'),
      description: t('services.backend.description'),
      features: [
        t('services.backend.f1'),
        t('services.backend.f2'),
        t('services.backend.f3'),
      ],
      highlight: true,
    },
    {
      name: t('services.fullstack.name'),
      price: t('services.fullstack.price'),
      period: t('services.fullstack.period'),
      description: t('services.fullstack.description'),
      features: [
        t('services.fullstack.f1'),
        t('services.fullstack.f2'),
        t('services.fullstack.f3'),
      ],
      highlight: false,
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-background border-t-2 border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4 text-5xl md:text-6xl font-black uppercase tracking-tighter">
            {t("services.title")}{" "}
            <span className="text-primary underline decoration-foreground decoration-4 underline-offset-4">
              {t("services.titleHighlight")}
            </span>
          </h2>
          <p className="text-xl font-medium max-w-2xl mx-auto border-2 border-border p-4 bg-background neo-shadow inline-block">
            {t("services.frontend.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className={cn(
                "p-8 border-2 border-border relative overflow-hidden transition-all duration-300 rounded-none",
                service.highlight
                  ? 'bg-primary text-primary-foreground scale-105 shadow-neo-lg z-10'
                  : 'bg-card text-card-foreground hover:scale-105 neo-shadow'
              )}
            >
              {service.highlight && (
                <div className="absolute top-0 right-0 bg-background text-foreground px-4 py-1 text-sm font-bold border-b-2 border-l-2 border-border z-20">
                  {t("services.popular")}
                </div>
              )}

              <div className="mb-6">
                <h3 className={cn(
                  "text-3xl font-black mb-2 uppercase",
                  service.highlight ? 'text-primary-foreground' : 'text-foreground'
                )}>
                  {service.name}
                </h3>
                <p className={cn(
                  "text-sm font-medium",
                  service.highlight ? 'text-primary-foreground/90' : 'text-muted-foreground'
                )}>
                  {service.description}
                </p>
              </div>

              <div className="mb-6 border-b-2 border-current pb-6 opacity-80">
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "text-4xl font-black",
                    service.highlight ? 'text-primary-foreground' : 'text-primary'
                  )}>
                    {service.price}
                  </span>
                  <span className={cn(
                    "font-bold uppercase text-sm",
                    service.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}>
                    /{service.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={cn(
                      "mt-1 p-0.5 border-2 flex-shrink-0",
                      service.highlight 
                        ? 'border-primary-foreground bg-primary-foreground text-primary' 
                        : 'border-border bg-primary text-primary-foreground'
                    )}>
                      <Check className="w-3 h-3" strokeWidth={4} />
                    </div>
                    <span className={cn(
                      "text-sm font-bold leading-tight",
                      service.highlight ? 'text-primary-foreground' : 'text-foreground'
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full border-2 border-border text-lg font-black uppercase tracking-wide neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-none h-14",
                  service.highlight 
                    ? 'bg-background text-foreground hover:bg-background/90' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {t("services.getStarted")}
                <ArrowRight className="ml-2 w-5 h-5 stroke-[3px]" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-xl font-bold mb-6">
             {t("contact.description")}
          </p>
          <Button 
            size="lg" 
            className="border-2 border-border text-xl font-black px-8 py-8 bg-background text-foreground hover:bg-accent neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase rounded-none"
          >
             {t("contact.formTitle")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
