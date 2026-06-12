import { getModuleBySlug } from "@/lib/curriculum";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getModuleBySlug(moduleId);
  if (!mod) return { title: "Module not found — Learn Go" };
  return { title: `${mod.title} — Learn Go` };
}

// The layout renders ModuleView directly (it owns sidebar state), so the page
// exists only for metadata. Throwing notFound() here would suppress the
// layout's not-found UI without ever showing the 404 boundary.
export default function ModulePage() {
  return null;
}
