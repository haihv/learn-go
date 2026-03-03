import { notFound } from "next/navigation";
import { getModuleBySlug } from "@/lib/curriculum";
import ModuleView from "./ModuleView";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getModuleBySlug(moduleId);
  if (!mod) return {};
  return { title: `${mod.title} — Learn Go` };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModuleBySlug(moduleId);
  if (!mod) notFound();
  // Pass only the slug — the client component looks up the module itself,
  // avoiding Next.js serialization errors for validate functions.
  return <ModuleView slug={moduleId} />;
}
