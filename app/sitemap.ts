import { MetadataRoute } from 'next'
import { createClient } from '@/integrations/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vitlaicodedao.tech'
  const supabase = await createClient()

  // Get all published blogs
  // @ts-expect-error - Supabase generated types cause deep instantiation error
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  // Get all published projects
  // @ts-expect-error - Supabase generated types cause deep instantiation error
  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })

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
    lastModified: new Date(blog.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Project pages
  const projectPages: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${baseUrl}/project/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages, ...projectPages]
}
