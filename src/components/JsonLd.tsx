/**
 * Emits a JSON-LD structured-data block.
 *
 * `<` is escaped so that a string inside the data (a title containing markup,
 * say) cannot close the script tag early and inject markup into the page.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
