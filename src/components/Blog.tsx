import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  created_at: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, cover_image, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching blogs:', error);
      } else {
        setBlogs(data || []);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const getReadTime = (excerpt: string) => {
    return Math.ceil(excerpt.split(' ').length / 200);
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4">
            {t('blog.title')} <span className="gradient-text">{t('blog.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('blog.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((post, index) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={post.cover_image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800'}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-foreground/60 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {getReadTime(post.excerpt)} {t('blog.readTime')}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-foreground/70 mb-4 line-clamp-3">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`}>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    {t('blog.readMore')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="border-2 border-primary hover:bg-primary/10">
            {t('blog.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
