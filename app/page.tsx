import { Metadata } from 'next'
import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import Skills from "@/components/Skills"
import Projects from "@/components/Projects"
import Testimonials from "@/components/Testimonials"
import Blog from "@/components/Blog"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import { createClient } from '@/integrations/supabase/server'

async function getSEOData() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("page_key", "home")
    .single()

  return data
}

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData()

  if (!seoData) {
    return {
      title: 'VietDev - Full-Stack Developer & AI Enthusiast',
      description: 'Building innovative web solutions with modern technologies and AI integration',
    }
  }

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords?.split(','),
    openGraph: {
      title: seoData.og_title || seoData.title,
      description: seoData.og_description || seoData.description,
      images: seoData.og_image ? [{ url: seoData.og_image }] : [],
      type: (seoData.og_type as any) || 'website',
    },
    twitter: {
      card: seoData.twitter_card as any || 'summary_large_image',
      site: seoData.twitter_site,
      title: seoData.og_title || seoData.title,
      description: seoData.og_description || seoData.description,
    },
    alternates: {
      canonical: seoData.canonical_url || 'https://vitlaicodedao.tech',
    },
  }
}

export default function HomePage() {
  // Enhanced structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "VietDev - Full-Stack Development Services",
    description:
      "Professional full-stack development services specializing in React, Node.js, TypeScript, and AI integration",
    url: "https://vitlaicodedao.tech",
    image: "https://vitlaicodedao.tech/og-image.jpg",
    logo: "https://vitlaicodedao.tech/logo.png",
    telephone: "+84-xxx-xxx-xxx",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
      addressLocality: "Vietnam",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "21.0285",
      longitude: "105.8542",
    },
    serviceType: [
      "Web Development",
      "Mobile App Development",
      "AI Integration",
      "Cloud Solutions",
      "API Development",
    ],
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    founder: {
      "@type": "Person",
      name: "Viet Dev",
      jobTitle: "Full-Stack Developer",
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
      />
      <Navigation />
      <Hero />
      <Skills />
      <Projects />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
    </div>
  )
}
