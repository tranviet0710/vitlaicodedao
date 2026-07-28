import { defaultSchema } from "rehype-sanitize";

/**
 * Rich-content vocabulary for blog posts.
 *
 * Posts are stored as Markdown, but authors need colour, callouts and image
 * layout. Rather than allowing arbitrary `style` attributes (which reopens XSS
 * via CSS injection), the editor emits a fixed set of class names and the
 * sanitizer allows *only* those values. Anything else is stripped, so a post is
 * safe to render even if the content were ever tampered with in the database.
 */

/** Background highlighter pens. */
export const HIGHLIGHT_CLASSES = [
  "hl-yellow",
  "hl-green",
  "hl-blue",
  "hl-pink",
  "hl-violet",
] as const;

/** Inline text colours. */
export const TEXT_COLOR_CLASSES = [
  "tx-violet",
  "tx-cyan",
  "tx-pink",
  "tx-green",
  "tx-red",
  "tx-muted",
] as const;

/** Callout / admonition boxes. */
export const CALLOUT_CLASSES = [
  "callout",
  "callout-info",
  "callout-tip",
  "callout-warn",
  "callout-danger",
] as const;

/** Image sizing and alignment. */
export const IMAGE_LAYOUT_CLASSES = [
  "img-full",
  "img-lg",
  "img-md",
  "img-sm",
  "img-left",
  "img-right",
  "img-center",
] as const;

/** Paragraph-level emphasis. */
export const BLOCK_CLASSES = ["lead", "embed-youtube"] as const;

const SPAN_CLASSES = [...HIGHLIGHT_CLASSES, ...TEXT_COLOR_CLASSES];
const DIV_CLASSES = [...CALLOUT_CLASSES, ...BLOCK_CLASSES];

/**
 * `hast-util-sanitize` treats an attribute entry of the form
 * `['className', 'a', 'b']` as "this attribute may only hold these values",
 * which is exactly the allowlist behaviour we want.
 */
export const richContentSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "img",
    "figure",
    "figcaption",
    "mark",
    "kbd",
    "u",
  ],
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img || []),
      "src",
      "alt",
      "title",
      "loading",
      "width",
      "height",
      ["className", ...IMAGE_LAYOUT_CLASSES],
    ],
    span: [
      ...(defaultSchema.attributes?.span || []),
      ["className", ...SPAN_CLASSES],
    ],
    mark: [["className", ...HIGHLIGHT_CLASSES]],
    div: [
      ...(defaultSchema.attributes?.div || []),
      ["className", ...DIV_CLASSES],
      "dataYoutubeId",
    ],
    p: [...(defaultSchema.attributes?.p || []), ["className", "lead"]],
    figure: [["className", ...IMAGE_LAYOUT_CLASSES]],
  },
};

/** YouTube ids are opaque tokens; reject anything that isn't one. */
export function isValidYouTubeId(id: unknown): id is string {
  return typeof id === "string" && /^[A-Za-z0-9_-]{6,20}$/.test(id);
}
