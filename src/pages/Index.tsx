import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [seoData, setSeoData] = useState<any>(null);

  useEffect(() => {
    const fetchSEO = async () => {
      const { data } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_key', 'home')
        .single();
      
      if (data) setSeoData(data);
    };

    fetchSEO();
  }, []);

  // Enhanced structured data for homepage
  const homepageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'VietDev - Full-Stack Development Services',
    description: 'Professional full-stack development services specializing in React, Node.js, TypeScript, and AI integration',
    url: 'https://vitlaicodedao.tech',
    image: 'https://vitlaicodedao.tech/og-image.jpg',
    logo: 'https://vitlaicodedao.tech/logo.png',
    telephone: '+84-xxx-xxx-xxx',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VN',
      addressLocality: 'Vietnam',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '21.0285',
      longitude: '105.8542',
    },
    serviceType: ['Web Development', 'Mobile App Development', 'AI Integration', 'Cloud Solutions', 'API Development'],
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide',
    },
    founder: {
      '@type': 'Person',
      name: 'Viet Dev',
      jobTitle: 'Full-Stack Developer',
    },
  };

  return (
    <div className="min-h-screen">
      {seoData ? (
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          ogTitle={seoData.og_title}
          ogDescription={seoData.og_description}
          ogImage={seoData.og_image}
          ogType={seoData.og_type}
          twitterCard={seoData.twitter_card}
          twitterSite={seoData.twitter_site}
          canonicalUrl={seoData.canonical_url}
          structuredData={homepageStructuredData}
        />
      ) : (
        <SEO structuredData={homepageStructuredData} />
      )}
      <Navigation />
      <Hero />
      <Skills />
      <Projects />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
