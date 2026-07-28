import { createPublicClient } from "@/integrations/supabase/public";
import { SITE_URL, SITE_NAME, AUTHOR_NAME, absoluteUrl } from "@/lib/site";

/**
 * RSS feed for the blog. Gives readers and aggregators a subscribe target and
 * gives search engines another discovery path into new posts.
 */
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const supabase = createPublicClient();
  const { data: blogs } = await supabase
    .from("blogs")
    .select("title, slug, excerpt, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(30);

  const items = (blogs || [])
    .map((blog) => {
      const url = absoluteUrl(`/blog/${blog.slug}`);
      const published = blog.created_at
        ? new Date(blog.created_at).toUTCString()
        : new Date().toUTCString();

      return `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(blog.excerpt || "")}</description>
      <pubDate>${published}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Blog</title>
    <link>${SITE_URL}</link>
    <description>Bài viết về lập trình web, React, Next.js và AI từ ${escapeXml(
      AUTHOR_NAME
    )}.</description>
    <language>vi-VN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl(
      "/feed.xml"
    )}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
