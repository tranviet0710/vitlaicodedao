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
  // Enhanced structured data for homepage with brand name
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vịt Lại Code Dạo",
    alternateName: ["vitlaicodedao", "VietDev", "Vit Lai Code Dao"],
    url: "https://vitlaicodedao.tech",
    description: "VietDev - Fullstack Developer với hơn 5 năm kinh nghiệm. Dạy lập trình web, chia sẻ kiến thức IT.",
    inLanguage: "vi-VN",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://vitlaicodedao.tech/blogs?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "VietDev",
    alternateName: ["Vịt Lại Code Dạo", "vitlaicodedao"],
    url: "https://vitlaicodedao.tech",
    image: "https://vitlaicodedao.tech/avt.png",
    jobTitle: "Fullstack Developer",
    description: "Fullstack Developer với hơn 5 năm kinh nghiệm. Chuyên cung cấp các dịch vụ về website, application. Dạy lập trình web.",
    sameAs: [
      "https://github.com/tranviet0710",
      "https://www.facebook.com/vitlaicodedao",
      "https://www.youtube.com/@vitlaicodedao"
    ],
    knowsAbout: [
      "React", "Next.js", "TypeScript", "Node.js", "Python",
      "Web Development", "Mobile Development", "AI Integration"
    ],
    worksFor: {
      "@type": "Organization",
      name: "Vịt Lại Code Dạo",
      url: "https://vitlaicodedao.tech"
    }
  };

  const professionalServiceStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Vịt Lại Code Dạo - VietDev",
    alternateName: "vitlaicodedao",
    description:
      "Dịch vụ phát triển web và mobile app chuyên nghiệp. React, Node.js, TypeScript, AI integration.",
    url: "https://vitlaicodedao.tech",
    image: "https://vitlaicodedao.tech/og-image.png",
    logo: "https://vitlaicodedao.tech/favicon.svg",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
      addressLocality: "Vietnam",
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    serviceType: [
      "Web Development",
      "Mobile App Development",
      "AI Integration",
      "Programming Tutoring",
    ],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceStructuredData) }}
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
