import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

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
}

const SEO = ({
  title = 'Viet Dev - Full-Stack Developer & AI Enthusiast',
  description = 'Professional full-stack developer specializing in React, Node.js, and AI integration. Building modern web applications with cutting-edge technologies.',
  keywords = 'full-stack developer, React, Node.js, AI, machine learning, web development',
  ogTitle,
  ogDescription,
  ogImage = '/placeholder.svg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@vietdev',
  canonicalUrl,
}: SEOProps) => {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalCanonicalUrl = canonicalUrl || window.location.href;

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
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Viet Dev" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en, vi" />
    </Helmet>
  );
};

export default SEO;
