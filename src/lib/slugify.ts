/**
 * Heading anchor slugs. Shared by the article renderer and the table of
 * contents so their links cannot drift apart.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip Vietnamese tone marks
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export interface TocEntry {
  level: 2 | 3;
  text: string;
  id: string;
}

/** Pull `##`/`###` headings out of Markdown, ignoring anything in code fences. */
export function extractHeadings(markdown: string): TocEntry[] {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "");
  const entries: TocEntry[] = [];

  for (const line of withoutCode.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;

    // Drop inline markdown so the label reads as plain text.
    const text = match[2]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .replace(/<[^>]+>/g, "")
      .trim();

    if (text) {
      entries.push({
        level: match[1].length === 2 ? 2 : 3,
        text,
        id: slugifyHeading(text),
      });
    }
  }

  return entries;
}
