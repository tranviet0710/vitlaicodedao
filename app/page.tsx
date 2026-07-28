import { Metadata } from 'next'
import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import Skills from "@/components/Skills"
import Projects from "@/components/Projects"
import Testimonials from "@/components/Testimonials"
import Blog from "@/components/Blog"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import { createPublicClient } from '@/integrations/supabase/public'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/site'

/**
 * The home page is identical for every visitor, so it is prerendered and
 * refreshed in the background instead of hitting Supabase on every request.
 */
export const revalidate = 300

async function getSEOData() {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("page_key", "home")
    .single()

  return data
}

/**
 * Fetched on the server so the featured projects and posts — and the internal
 * links to them — are in the prerendered HTML instead of appearing only after
 * client-side effects run.
 */
async function getHomeContent() {
  const supabase = createPublicClient()

  const [{ data: projects }, { data: blogs }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("blogs")
      .select("id, title, slug, excerpt, cover_image, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3),
  ])

  return { projects: projects || [], blogs: blogs || [] }
}

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData()

  if (!seoData) {
    return {
      title: 'VietDev - Full-Stack Developer & AI Enthusiast',
      description: 'Building innovative web solutions with modern technologies and AI integration',
    }
  }

  // A page-level `openGraph` block replaces the layout's entirely, so an empty
  // `og_image` in the database left the home page — the most-shared URL on the
  // site — with no social card image at all.
  const ogImage = seoData.og_image || DEFAULT_OG_IMAGE

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords?.split(','),
    openGraph: {
      title: seoData.og_title || seoData.title,
      description: seoData.og_description || seoData.description,
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: (seoData.og_type as any) || 'website',
    },
    twitter: {
      card: seoData.twitter_card as any || 'summary_large_image',
      site: seoData.twitter_site,
      title: seoData.og_title || seoData.title,
      description: seoData.og_description || seoData.description,
      images: [ogImage],
    },
    alternates: {
      canonical: seoData.canonical_url || SITE_URL,
    },
  }
}

export default async function HomePage() {
  const { projects, blogs } = await getHomeContent()

  // Enhanced structured data for homepage with brand name
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vịt Lại Code Dạo",
    alternateName: ["vitlaicodedao", "VietDev", "Vit Lai Code Dao"],
    url: "https://www.vitlaicodedao.tech",
    description: "VietDev - Fullstack Developer với hơn 5 năm kinh nghiệm. Dạy lập trình web, chia sẻ kiến thức IT.",
    inLanguage: "vi-VN",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.vitlaicodedao.tech/blogs?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "VietDev",
    alternateName: ["Vịt Lại Code Dạo", "vitlaicodedao"],
    url: "https://www.vitlaicodedao.tech",
    image: "https://www.vitlaicodedao.tech/avt.png",
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
      url: "https://www.vitlaicodedao.tech"
    }
  };

  const professionalServiceStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Vịt Lại Code Dạo - VietDev",
    alternateName: "vitlaicodedao",
    description:
      "Dịch vụ phát triển web và mobile app chuyên nghiệp. React, Node.js, TypeScript, AI integration.",
    url: "https://www.vitlaicodedao.tech",
    image: "https://www.vitlaicodedao.tech/og-image.png",
    logo: "https://www.vitlaicodedao.tech/favicon.svg",
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
      <Projects initialProjects={projects} />
      <Testimonials />
      <Blog initialBlogs={blogs} />
      <Contact />
      <Footer />
    </div>
  )
}
