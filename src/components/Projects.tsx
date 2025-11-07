import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

const Projects = () => {
  const [filter, setFilter] = useState('all');

  const projects = [
    {
      title: 'E-Commerce Platform',
      category: 'fullstack',
      description: 'Full-featured e-commerce platform với React, Node.js, và PostgreSQL. Hỗ trợ thanh toán online và quản lý inventory.',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
    {
      title: 'AI Chat Application',
      category: 'frontend',
      description: 'Real-time chat application tích hợp AI chatbot. Sử dụng WebSocket cho messaging và OpenAI API.',
      tags: ['React', 'TypeScript', 'WebSocket', 'OpenAI'],
      image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
    {
      title: 'Portfolio CMS',
      category: 'fullstack',
      description: 'Content Management System cho portfolio websites với drag-and-drop builder và real-time preview.',
      tags: ['Next.js', 'MongoDB', 'AWS', 'TailwindCSS'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
    {
      title: 'Mobile Fitness App',
      category: 'mobile',
      description: 'Cross-platform fitness tracking app với workout plans, nutrition tracking và social features.',
      tags: ['React Native', 'Firebase', 'Redux', 'Expo'],
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
    {
      title: 'Analytics Dashboard',
      category: 'frontend',
      description: 'Real-time analytics dashboard với data visualization và customizable widgets.',
      tags: ['Vue.js', 'D3.js', 'Chart.js', 'WebSocket'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
    {
      title: 'Booking System',
      category: 'fullstack',
      description: 'Online booking system cho các dịch vụ với calendar integration và automated notifications.',
      tags: ['React', 'Express', 'MySQL', 'Redis'],
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      github: 'https://github.com',
      demo: 'https://demo.com',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'mobile', label: 'Mobile' },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            Các dự án nổi bật đã triển khai thành công
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                variant={filter === cat.value ? 'default' : 'outline'}
                className={filter === cat.value ? 'bg-gradient-primary' : ''}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-card border-border/50 group card-hover"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-foreground/70 mb-4 text-sm">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(project.github, '_blank')}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-primary"
                    onClick={() => window.open(project.demo, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
