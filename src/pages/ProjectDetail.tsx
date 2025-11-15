import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Project {
  id: string;
  title: string;
  description: string;
  content: string | null;
  thumbnail: string | null;
  category: string;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[] | null;
}

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching project:', error);
      } else {
        setProject(data);
      }
      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('common.notFound')}</h1>
          <p className="text-foreground/70 mb-8">{t('projects.notFoundDescription')}</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToHome')}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={`${project.title} - Viet Dev Projects`}
        description={project.description}
        ogTitle={project.title}
        ogDescription={project.description}
        ogImage={project.thumbnail || '/placeholder.svg'}
        ogType="article"
        canonicalUrl={`${window.location.origin}/project/${slug}`}
      />
      <Navigation />
      
      <article className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/#projects">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToProjects')}
            </Button>
          </Link>

          {project.thumbnail && (
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8 group">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          )}

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-foreground/70">{project.description}</p>
          </div>

          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">{t('projects.techStack')}</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-12 pb-12 border-b border-border">
            {project.demo_url && (
              <Button asChild size="lg">
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('projects.viewDemo')}
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button asChild variant="outline" size="lg">
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t('projects.viewCode')}
                </a>
              </Button>
            )}
          </div>

          {project.content && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {project.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
