import { List } from "lucide-react";
import { extractHeadings } from "@/lib/slugify";

/**
 * Server-rendered contents list — no client JS, and the internal links give
 * search engines extra structure for sitelinks.
 */
export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);

  // Not worth the visual weight on short posts.
  if (headings.length < 3) return null;

  return (
    <details
      open
      className="neo-shadow mb-12 border-2 border-border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 font-heading text-lg font-bold">
        <List className="h-5 w-5 text-primary" />
        Nội dung bài viết
      </summary>
      <nav aria-label="Table of contents">
        <ol className="mt-4 space-y-2 border-t-2 border-border pt-4">
          {headings.map((heading, index) => (
            <li
              key={`${heading.id}-${index}`}
              className={heading.level === 3 ? "ml-5" : ""}
            >
              <a
                href={`#${heading.id}`}
                className="text-sm text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
