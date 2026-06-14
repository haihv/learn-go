import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStemBySlug, stems } from "@/lib/stems";
import StemShell from "@/components/stem/StemShell";

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
  if (!stem) return {};
  return { title: `${stem.title} — Deep Stem — Learn Go` };
}

export default async function StemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stem = getStemBySlug(slug);
  if (!stem) notFound();
  return <StemShell stem={stem} />;
}
