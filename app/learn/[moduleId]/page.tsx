import { getModuleBySlug } from "@/lib/curriculum";
import type { Metadata } from "next";

const KIND: Record<string, string> = {
  lesson: "an interactive lesson with a quick quiz",
  workshop: "a step-by-step guided workshop",
  lab: "a free-form coding lab with an automated test suite",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getModuleBySlug(moduleId);
  if (!mod) return { title: "Module not found", robots: { index: false, follow: true } };
  const description = `Learn Go: ${mod.title} — ${KIND[mod.type]}, runnable in your browser. ~${mod.estimatedMinutes} min.`;
  const url = `/learn/${mod.slug}`;
  return {
    title: mod.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${mod.title} — Learn Go`, description, url, type: "article" },
    twitter: { title: `${mod.title} — Learn Go`, description },
  };
}

// The layout renders ModuleView directly (it owns sidebar state), so the page
// exists only for metadata. Throwing notFound() here would suppress the
// layout's not-found UI without ever showing the 404 boundary.
export default function ModulePage() {
  return null;
}
