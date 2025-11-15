import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import DOMPurify from 'dompurify';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  created_at: string;
  published: boolean;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Error fetching blog:', error);
      } else {
        setBlog(data);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog post not found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('blog.backToBlog')}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const readTime = Math.ceil(blog.content.split(' ').length / 200);

  return (
    <div className="min-h-screen">
      <SEO
        title={`${blog.title} - Viet Dev Blog`}
        description={blog.excerpt}
        ogTitle={blog.title}
        ogDescription={blog.excerpt}
        ogImage={blog.cover_image || '/placeholder.svg'}
        ogType="article"
        canonicalUrl={`${window.location.origin}/blog/${blog.slug}`}
      />
      <Navigation />
      
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/#blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('blog.backToBlog')}
            </Button>
          </Link>

          {blog.cover_image && (
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />
          )}

          <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(blog.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readTime} {t('blog.readTime')}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>
          
          <p className="text-xl text-foreground/70 mb-12">{blog.excerpt}</p>

          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(blog.content, {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'],
                ALLOWED_ATTR: ['href', 'target', 'rel']
              })
            }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;
