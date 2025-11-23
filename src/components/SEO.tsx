import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterSite?: string;
  canonicalUrl?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  structuredData?: object;
}

const SEO = ({
  title = "Viet Dev - Full-Stack Developer & AI Enthusiast | React, Node.js, TypeScript Expert",
  description = "Professional full-stack developer specializing in React, Node.js, TypeScript, and AI integration. Expert in building modern web applications, mobile apps, and scalable cloud solutions. Available for freelance projects and consulting.",
  keywords = "full-stack developer, React developer, Node.js expert, TypeScript, AI integration, machine learning, web development, mobile development, Vietnam developer, freelance developer, software engineer, cloud solutions, API development",
  ogTitle,
  ogDescription,
  ogImage = "https://vitlaicodedao.tech/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterSite = "@vietdev",
  canonicalUrl,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor = "Viet Dev",
  structuredData,
}: SEOProps) => {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalCanonicalUrl = canonicalUrl || window.location.href;
  const siteUrl = "https://vitlaicodedao.tech";

  // Default structured data for the website
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Viet Dev",
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    sameAs: [
      "https://github.com/tranviet0710",
      "https://linkedin.com/in/vietdev",
      "https://twitter.com/vietdev",
    ],
    jobTitle: "Full-Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "VietDev Solutions",
    },
    knowsAbout: [
      "React",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "Python",
      "AI Integration",
      "Machine Learning",
      "Web Development",
      "Mobile Development",
      "Cloud Computing",
    ],
    description: description,
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  useEffect(() => {
    // Update meta tags dynamically
    document.title = title;
  }, [title]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:site_name" content="Viet Dev" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO Tags */}
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="author" content={articleAuthor} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en, vi" />
      <meta name="language" content="English, Vietnamese" />
      <meta name="geo.region" content="VN" />
      <meta name="geo.placename" content="Vietnam" />
      <meta name="theme-color" content="#667eea" />

      {/* Article specific tags */}
      {articlePublishedTime && (
        <meta
          property="article:published_time"
          content={articlePublishedTime}
        />
      )}
      {articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}

      {/* Additional Open Graph Tags */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="vi_VN" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Alternate languages */}
      <link rel="alternate" hrefLang="en" href={finalCanonicalUrl} />
      <link rel="alternate" hrefLang="vi" href={finalCanonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={finalCanonicalUrl} />
    </Helmet>
  );
};

export default SEO;
