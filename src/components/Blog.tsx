import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      title: 'React Performance Optimization: Best Practices 2024',
      excerpt: 'Tìm hiểu các kỹ thuật optimization giúp React app của bạn chạy nhanh hơn 10x. Từ code splitting đến memoization...',
      category: 'React',
      date: '15 Tháng 11, 2024',
      readTime: '8 phút đọc',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    },
    {
      title: 'Kinh nghiệm làm việc remote hiệu quả cho developers',
      excerpt: 'Sau 3 năm làm việc remote, đây là những bài học và tips giúp tôi maintain work-life balance và productivity...',
      category: 'Lifestyle',
      date: '10 Tháng 11, 2024',
      readTime: '5 phút đọc',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    },
    {
      title: 'Node.js Microservices Architecture: A Complete Guide',
      excerpt: 'Xây dựng scalable microservices với Node.js, Docker và Kubernetes. Real-world examples và best practices...',
      category: 'Backend',
      date: '5 Tháng 11, 2024',
      readTime: '12 phút đọc',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    },
  ];

  return (
    <section id="blog" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4">
            Latest <span className="gradient-text">Blog Posts</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Chia sẻ kiến thức về lập trình và cuộc sống
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-card border-border/50 group card-hover"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-foreground/60 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-foreground/70 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Button variant="outline" className="group/btn">
                  Đọc thêm
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-primary">
            Xem tất cả bài viết
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
