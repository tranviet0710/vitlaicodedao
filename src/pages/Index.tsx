import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Services from '@/components/Services';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Skills />
      <Projects />
      <Testimonials />
      <Services />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
