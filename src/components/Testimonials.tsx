import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO, Tech Startup',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      rating: 5,
      text: 'Làm việc rất chuyên nghiệp và hiệu quả. Project được deliver đúng deadline và chất lượng vượt mong đợi. Highly recommended!',
    },
    {
      name: 'Trần Thị B',
      role: 'Product Manager, E-commerce Co.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 5,
      text: 'Code quality tuyệt vời, communication rõ ràng. Đã giúp chúng tôi scale up hệ thống một cách smooth. Sẽ tiếp tục hợp tác lâu dài.',
    },
    {
      name: 'Lê Văn C',
      role: 'CTO, Fintech Platform',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      rating: 5,
      text: 'Expert trong việc xử lý các technical challenges phức tạp. Rất impressed với kiến thức sâu về architecture và performance optimization.',
    },
    {
      name: 'Phạm Thị D',
      role: 'Marketing Director',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      rating: 5,
      text: 'Website mới giúp conversion rate tăng 40%. Design đẹp, UX tốt và performance xuất sắc. Worth every penny!',
    },
    {
      name: 'Hoàng Văn E',
      role: 'Startup Founder',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      rating: 5,
      text: 'Từ MVP đến production app chỉ trong 6 tuần. Agile workflow cực kỳ hiệu quả. Best developer tôi từng làm việc cùng.',
    },
    {
      name: 'Võ Thị F',
      role: 'E-learning Platform Owner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      rating: 5,
      text: 'Platform của chúng tôi giờ handle được 10k+ concurrent users. Performance optimization tuyệt vời. Cảm ơn team rất nhiều!',
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4">
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Phản hồi từ các khách hàng đã hợp tác
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border/50 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full border-2 border-primary"
                />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground/80 italic">"{testimonial.text}"</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
