'use client'

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  content: string;
  rating: number;
  client_avatar: string | null;
}

const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial, index: number }) => {
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { delay: index * 0.15, type: 'spring' as const, stiffness: 100 }
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="relative p-8 bg-background border-2 border-border neo-shadow group"
    >
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 rounded-full border-2 border-border overflow-hidden">
            <img
              src={testimonial.client_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.client_name}`}
              alt={testimonial.client_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-lg font-heading">{testimonial.client_name}</h4>
            <p className="text-sm font-medium text-muted-foreground">{testimonial.client_role}</p>
          </div>
        </div>
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-5 h-5 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted stroke-muted-foreground'}`} 
            />
          ))}
        </div>
        <p className="text-foreground italic leading-relaxed font-medium">"{testimonial.content}"</p>
      </div>
    </motion.div>
  );
};


const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
      } else {
        setTestimonials(data || []);
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
  };

  return (
    <section id="testimonials" className="py-20 md:py-32 relative overflow-hidden bg-background border-t-2 border-border">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 font-heading text-4xl md:text-5xl font-black uppercase tracking-tight">
            {t('testimonials.title')} <span className="text-primary">{t('testimonials.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-foreground font-medium max-w-2xl mx-auto">
            {t('testimonials.description')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-background border-2 border-border p-8 h-64 neo-shadow animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
