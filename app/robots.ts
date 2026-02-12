import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/auth',
          '/auth/',
          '/*.json$',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/admin', '/auth', '/auth/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/admin', '/auth', '/auth/'],
      },
      // Social media crawlers - allow full access to public content
      {
        userAgent: ['Twitterbot', 'facebookexternalhit', 'LinkedInBot'],
        allow: '/',
      },
    ],
    sitemap: 'https://vitlaicodedao.tech/sitemap.xml',
    host: 'https://vitlaicodedao.tech',
  }
}
