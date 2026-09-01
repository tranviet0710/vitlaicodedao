import { Children, isValidElement, type ReactNode } from "react";
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";
import { isValidYouTubeId, richContentSchema } from "@/lib/markdown-schema";
import { slugifyHeading } from "@/lib/slugify";
import { isOptimizableImage } from "@/lib/image";
import { CopyCodeButton } from "./CopyCodeButton";

/**
 * The single renderer for rich content, shared by the public blog and project
 * pages and the admin editor preview so that "what you see while writing"
 * cannot drift from what readers get.
 */

/**
 * Characters people draw their own separators with when pasting from Telegram,
 * a README or a chat log. Markdown gives them no meaning, so a run of them is
 * one unbreakable "word" that runs straight past the edge of the column.
 */
const RULE_LINE = /^[ \t]*[\u2500-\u257F\u2580-\u259F\u2010-\u2015\u23AF]{3,}[ \t]*$/;
const FENCE_LINE = /^[ \t]*(?:```|~~~)/;

/**
 * Rewrite those hand-drawn rules as real thematic breaks, leaving fenced code
 * (where the characters may be meaningful box art) untouched.
 *
 * `***` is used rather than `---` because `---` directly under a line of text
 * is a setext underline, which would silently promote the paragraph above it
 * to a heading instead of drawing a rule.
 */
function normalizeDrawnRules(markdown: string): string {
  let inFence = false;

  return markdown
    .split("\n")
    .map((line) => {
      if (FENCE_LINE.test(line)) {
        inFence = !inFence;
        return line;
      }
      return !inFence && RULE_LINE.test(line) ? "***" : line;
    })
    .join("\n");
}

/** Flatten a React subtree to plain text, for heading anchors and copy buttons. */
function toText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return toText(child.props.children);
      }
      return "";
    })
    .join("");
}

/** Headings become deep-linkable, which also feeds the table of contents. */
function heading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as const;
  return function Heading({ children }: { children?: ReactNode }) {
    const id = slugifyHeading(toText(children));
    return (
      <Tag id={id} className="group scroll-mt-28">
        {children}
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-3 text-primary opacity-0 transition-opacity group-hover:opacity-100 no-underline"
        >
          #
        </a>
      </Tag>
    );
  };
}

const components: Components = {
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),

  a: ({ node, href, ...props }) => {
    const isInternal = href?.startsWith("/") || href?.startsWith("#");
    return (
      <a
        href={href}
        {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        {...props}
      />
    );
  },

  /**
   * Layout classes (`img-md`, `img-left`, …) may be written on the image, but
   * they have to end up on the `figure` for floats and max-widths to work, so
   * they are lifted here. Plain `![alt](url)` markdown and an explicit
   * `<img class="…">` therefore behave identically.
   */
  img: ({ node, ...props }) => {
    const src = typeof props.src === "string" ? props.src : "";
    const alt = props.alt || "";
    if (!src) return null;

    const layout = props.className || "img-full img-center";

    // Images we host go through Next's optimizer (AVIF/WebP + srcset). Anything
    // else is rendered plainly, since arbitrary hosts are deliberately not
    // allowlisted in next.config.js.
    const picture = isOptimizableImage(src) ? (
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        sizes="(max-width: 768px) 100vw, 800px"
        className="neo-img !my-0 w-full"
        style={{ width: "100%", height: "auto" }}
      />
    ) : (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="neo-img !my-0 w-full"
      />
    );

    return (
      <figure className={cn("my-8", layout)}>
        {picture}
        {alt && (
          <figcaption className="mt-3 text-center text-sm italic text-muted-foreground">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },

  code: ({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");

    // Inline code carries no language class.
    if (!match) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    const raw = toText(children).replace(/\n$/, "");
    return (
      <div className="group relative my-6">
        <span className="absolute top-3 left-3 rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          {match[1]}
        </span>
        <CopyCodeButton code={raw} />
        <pre className="neo-shadow overflow-x-auto border-2 border-border bg-card p-4 pt-11 text-card-foreground">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  },

  /**
   * A standalone `![alt](url)` is parsed as a paragraph containing an image,
   * but we render images as `figure`, which is not valid inside `p` and would
   * be broken out of it by the browser (breaking hydration). Unwrap those.
   */
  p: ({ node, children, ...props }) => {
    const meaningful = (node?.children ?? []).filter(
      (child) => !(child.type === "text" && child.value.trim() === "")
    );
    const isLoneImage =
      meaningful.length === 1 &&
      meaningful[0].type === "element" &&
      meaningful[0].tagName === "img";

    if (isLoneImage) return <>{children}</>;
    return <p {...props}>{children}</p>;
  },

  table: ({ node, ...props }) => (
    <div className="neo-shadow my-6 overflow-x-auto border-2 border-border">
      <table className="min-w-full bg-card" {...props} />
    </div>
  ),

  /**
   * Callouts and YouTube embeds both arrive as `div`s carrying an allowlisted
   * class. The embed never allows a raw iframe through the sanitizer — only an
   * id, which is validated here before being turned into an iframe.
   */
  div: ({ node, className, children, ...props }) => {
    const classes = className || "";

    if (classes.includes("embed-youtube")) {
      const id = (props as Record<string, unknown>)["data-youtube-id"];
      if (!isValidYouTubeId(id)) return null;
      return (
        <div className="neo-shadow my-8 aspect-video w-full border-2 border-border bg-card">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title="YouTube video"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      );
    }

    return (
      <div className={classes} {...props}>
        {children}
      </div>
    );
  },
};

const PROSE_CLASSES = `prose prose-lg dark:prose-invert max-w-none break-words
  prose-headings:text-foreground prose-headings:font-bold prose-headings:font-heading
  prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-6 prose-h1:mt-10 prose-h1:leading-tight
  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-primary prose-h2:border-b-2 prose-h2:border-border prose-h2:pb-3
  prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-5 prose-h3:mt-8
  prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
  prose-a:text-primary prose-a:font-bold prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4
  prose-strong:text-foreground prose-strong:font-bold
  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
  prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
  prose-li:text-foreground/90 prose-li:my-2
  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-accent/20 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-foreground/90
  prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
  prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0
  prose-hr:border-border prose-hr:border-t-2 prose-hr:my-10`;

export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn(PROSE_CLASSES, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, richContentSchema]]}
        components={components}
      >
        {normalizeDrawnRules(content)}
      </ReactMarkdown>
    </div>
  );
}
