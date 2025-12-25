'use client'

import { Code2, Database, Globe, Smartphone, Cloud, Brain, Server, Layers, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const TechRadarItem = ({ category, skills, index }: { category: string, skills: string[], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="mb-8"
    >
      <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-border pb-2 inline-block">
        {category}
      </h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, i) => (
          <div key={i} className="group relative">
             <div className="px-4 py-2 bg-white border-2 border-border text-black font-mono font-bold text-sm neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-default">
               {skill}
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const { t } = useLanguage();

  const categories = [
    {
      name: t("skills.cat.architecture"),
      skills: ["Microservices", "Event-Driven Design", "Domain-Driven Design (DDD)", "Serverless", "System Design"]
    },
    {
        name: t("skills.cat.backend"),
        skills: ["Node.js", "Go", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"]
    },
    {
        name: t("skills.cat.frontend"),
        skills: ["React", "Next.js", "TypeScript", "Performance Tuning", "State Management"]
    },
    {
        name: t("skills.cat.ai"),
        skills: ["RAG Pipelines", "Vector Databases", "LangChain", "ETL Processes", "Python"]
    }
  ];

  return (
    <section id="skills" className="py-20 md:py-32 bg-accent/10 border-t-2 border-border relative">
       {/* Decorative Elements */}
       <div className="absolute right-0 top-0 p-4 opacity-20 pointer-events-none">
          <Brain size={200} strokeWidth={0.5} />
       </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block bg-primary text-primary-foreground px-4 py-1 font-bold uppercase tracking-wider mb-4 border-2 border-border neo-shadow">
            {t("skills.capabilities")}
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 font-heading">
             {t("skills.techRadar")}
          </h2>
          <p className="text-xl font-medium max-w-2xl mx-auto leading-relaxed">
             {t("skills.techRadarDesc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
           {categories.map((cat, i) => (
              <TechRadarItem key={i} category={cat.name} skills={cat.skills} index={i} />
           ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
