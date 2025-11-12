import { Code2, Database, Globe, Smartphone, Cloud, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Skills = () => {
  const { t } = useLanguage();
  
  const skillCategories = [
    {
      icon: Code2,
      title: t('skills.frontend'),
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js'],
      color: 'text-primary',
    },
    {
      icon: Database,
      title: t('skills.backend'),
      skills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB'],
      color: 'text-accent',
    },
    {
      icon: Cloud,
      title: t('skills.cloud'),
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      color: 'text-primary',
    },
    {
      icon: Smartphone,
      title: t('skills.mobile'),
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'PWA'],
      color: 'text-accent',
    },
    {
      icon: Globe,
      title: t('skills.web'),
      skills: ['HTML5', 'CSS3', 'JavaScript', 'REST API', 'GraphQL'],
      color: 'text-primary',
    },
    {
      icon: Brain,
      title: t('skills.ai'),
      skills: ['OpenAI', 'TensorFlow', 'LangChain', 'Hugging Face', 'Lovable AI'],
      color: 'text-accent',
    },
  ];

  return (
    <section id="skills" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4">
            {t('skills.title')} <span className="gradient-text">{t('skills.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('skills.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card hover:bg-card/80 transition-all duration-300 card-hover border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">
                  <Icon className={`w-12 h-12 ${category.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
