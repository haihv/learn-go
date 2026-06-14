// Inline JSON-LD structured data. A server component — emits a single
// <script type="application/ld+json"> that search engines parse for rich
// results. (CSP allows inline scripts via 'unsafe-inline'.)
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
