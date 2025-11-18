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
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";


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

  return (
    <div className="min-h-screen">
      {seoData && (
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
        />
      )}
      <Navigation />
      <Hero />
      <Skills />
      <Projects />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
      <Analytics/>
      <SpeedInsights/>
    </div>
  );
};

export default Index;
