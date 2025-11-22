import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  category: string;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[] | null;
}

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const { t } = useLanguage();
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { delay: index * 0.15, type: 'spring', stiffness: 100 }
    },
  };

  return (
    <motion.a 
      href={`/project/${project.slug}`}
      variants={cardVariants}
      className="relative block bg-background/50 border border-primary/20 rounded-xl overflow-hidden group"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="absolute -inset-px bg-gradient-to-r from-primary to-accent rounded-xl blur-sm opacity-0 group-hover:opacity-75 transition duration-300"></div>
      
      <div className="relative">
        <div className="relative">
          <img
            src={project.thumbnail || 'https://placehold.co/800x600/0D0D0D/00BFFF?text=Project'}
            alt={project.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        </div>
        <div className="p-6">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3 border border-primary/20">
            {project.category}
          </span>
          <h3 className="text-2xl font-bold mb-3 font-heading">{project.title}</h3>
          <p className="text-foreground/70 mb-4 h-24 overflow-hidden">{project.description}</p>
          {project.tech_stack && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech_stack.slice(0, 4).map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-2 py-1 bg-secondary text-foreground/80 rounded-md text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 mt-auto">
            {project.demo_url && (
              <Button size="sm" asChild onClick={(e) => e.stopPropagation()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('projects.viewDemo')}
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button size="sm" variant="outline" asChild onClick={(e) => e.stopPropagation()} className="border-primary text-primary hover:bg-primary/10">
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  {t('projects.viewCode')}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.a>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
  };

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 font-heading">
            {t('projects.title')} <span className="text-primary">{t('projects.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('projects.description')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-background/50 border border-primary/20 rounded-xl p-6 h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        )}

        <div className="text-center">
          <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6">
            {t('projects.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
