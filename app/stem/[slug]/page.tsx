import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStemBySlug, stems } from "@/lib/stems";
import StemShell from "@/components/stem/StemShell";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return stems.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stem = getStemBySlug(slug);
  if (!stem) return { title: "Deep stem not found", robots: { index: false, follow: true } };
  const description = `${stem.oneLiner} A Bloom-laddered deep dive — Remember to Create. ~${stem.estimatedMinutes} min.`;
  const url = `/stem/${stem.slug}`;
  return {
    title: `${stem.title} — Deep Stem`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${stem.title} — Deep Stem — Learn Go`, description, url, type: "article" },
    twitter: { title: `${stem.title} — Deep Stem — Learn Go`, description },
  };
}

export default async function StemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stem = getStemBySlug(slug);
  if (!stem) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `${stem.title} — Deep Stem`,
    description: stem.oneLiner,
    url: `${SITE_URL}/stem/${stem.slug}`,
    inLanguage: "en",
    isAccessibleForFree: true,
    learningResourceType: "Interactive deep dive",
    educationalLevel: "Intermediate",
    teaches: stem.levels.map((l) => l.title),
    timeRequired: `PT${stem.estimatedMinutes}M`,
    isPartOf: { "@type": "Course", name: SITE_NAME, url: SITE_URL },
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <StemShell stem={stem} />
    </>
  );
}
