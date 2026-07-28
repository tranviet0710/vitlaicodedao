import { MetadataRoute } from 'next'
import { createPublicClient } from '@/integrations/supabase/public'
import { SITE_URL } from '@/lib/site'

/** Regenerate at most hourly rather than on every crawler hit. */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const supabase = createPublicClient()

  // Get all published blogs
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  // Get all projects.
  // NOTE: this used to filter `.eq('status', 'published')`, but `projects` has
  // no `status` column (that belongs to `support_requests`). PostgREST rejected
  // the query, the error was discarded, and every project silently dropped out
  // of the sitemap. All projects in this table are public.
  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .order('updated_at', { ascending: false })

  /**
   * `updated_at` can be null, and `new Date(null)` silently becomes 1970 —
   * which tells crawlers the page is ancient. Fall back to "now" instead.
   */
  const lastModified = (value: unknown): Date => {
    const date = value ? new Date(value as string) : new Date()
    return Number.isNaN(date.getTime()) ? new Date() : date
  }

  // Static pages - only include real crawlable pages, not hash anchors
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: lastModified(blog.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Project pages
  const projectPages: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${baseUrl}/project/${project.slug}`,
    lastModified: lastModified(project.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages, ...projectPages]
}
