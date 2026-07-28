/** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : '**.supabase.co';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Modern formats cut image weight substantially over JPEG/PNG.
    formats: ['image/avif', 'image/webp'],
    // Previously `hostname: '**'`, which let anyone use this deployment as a
    // free image-resizing proxy. Only our own storage needs optimising.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    const noIndex = [
      {
        key: 'X-Robots-Tag',
        value: 'noindex, nofollow',
      },
    ];

    return [
      {
        // Prevent indexing of admin and auth pages
        source: '/admin/:path*',
        headers: noIndex,
      },
      {
        source: '/auth',
        headers: noIndex,
      },
      {
        source: '/api/:path*',
        headers: noIndex,
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Fingerprinted build assets are safe to cache forever.
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Empty turbopack config to silence the warning
  turbopack: {},
};

module.exports = nextConfig;
