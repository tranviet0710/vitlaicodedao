import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Senior Software Developer
            </span>
          </div>
          
          <h1 className="mb-6 leading-tight">
            Xin chào! Tôi là <span className="gradient-text">Your Name</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Full-stack Developer chuyên về React, Node.js & Cloud Architecture. 
            Biến ý tưởng của bạn thành hiện thực với code chất lượng cao.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-gradient-primary text-lg px-8 py-6 group">
              Xem Projects
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-primary hover:bg-primary/10">
              Download CV
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              <Github size={28} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              <Linkedin size={28} />
            </a>
            <a 
              href="mailto:your.email@example.com"
              className="text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              <Mail size={28} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
