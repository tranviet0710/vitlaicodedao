'use client'

import { Code2, Database, Globe, Smartphone, Cloud, Brain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const SkillCard = ({ icon: Icon, title, skills, color, index }: { icon: React.ElementType, title: string, skills: string[], color: string, index: number }) => {
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { delay: index * 0.1, type: 'spring' as const, stiffness: 100 }
    },
  };
  
  return (
    <motion.div
      variants={cardVariants}
      className="relative p-6 bg-background/50 border border-primary/20 rounded-xl overflow-hidden group"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
      
      <div className="relative z-10">
        <div className="mb-4">
          <Icon className={`w-12 h-12 ${color}`} style={{ filter: `drop-shadow(0 0 5px hsla(var(--primary), 0.7))`}} />
        </div>
        <h3 className="text-xl font-bold mb-4 font-heading">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

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
      color: 'text-primary',
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
      color: 'text-primary',
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
      color: 'text-primary',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
  };

  return (
    <section id="skills" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, hsl(var(--primary)/0.05) 25%, hsl(var(--primary)/0.05) 26%, transparent 27%, transparent 74%, hsl(var(--primary)/0.05) 75%, hsl(var(--primary)/0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, hsl(var(--primary)/0.05) 25%, hsl(var(--primary)/0.05) 26%, transparent 27%, transparent 74%, hsl(var(--primary)/0.05) 75%, hsl(var(--primary)/0.05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px',
            animation: 'move 10s linear infinite'
          }}
        />
      </div>
      <style>{`
        @keyframes move {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 font-heading">
            {t('skills.title')} <span className="text-primary">{t('skills.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('skills.description')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skillCategories.map((category, index) => (
            <SkillCard key={index} {...category} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
