import { curriculum } from "@/lib/curriculum";
import { stems, atlas, getDomainTitle } from "@/lib/stems";
import type { CourseModule } from "@/lib/curriculum/types";
import type { Stem } from "@/lib/stems";
import type { SearchDoc } from "./types";

// Markdown → plain text. Good enough for indexing and snippets: we keep the
// words (including code, which learners search for) and drop the syntax.
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[a-z]*\n?/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    // Emphasis markers only at word edges — snake_case identifiers keep their _
    .replace(/(^|[^\p{L}\p{N}])[*_~]{1,3}([^*_~\n]+?)[*_~]{1,3}(?![\p{L}\p{N}])/gu, "$1$2")
    .replace(/^-{3,}$/gm, " ")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function moduleBody(m: CourseModule): string {
  switch (m.type) {
    case "lesson":
      return stripMarkdown(m.content) + " " + m.quiz.map((q) => q.question).join(" ");
    case "workshop":
      return (
        stripMarkdown(m.description) +
        " " +
        m.steps.map((s) => stripMarkdown(s.instruction)).join(" ")
      );
    case "lab":
      return (
        stripMarkdown(m.description) +
        " " +
        stripMarkdown(m.instructions) +
        " " +
        m.tests.map((t) => `${t.name} ${t.description}`).join(" ")
      );
  }
}

function stemBody(s: Stem): string {
  const levels = s.levels
    .map((l) => {
      const parts: string[] = [l.title, l.lead];
      switch (l.level) {
        case 1:
          parts.push(...l.terms.flatMap((t) => [t.term, t.reveal]));
          break;
        case 2:
          parts.push(...l.stages.flatMap((st) => [st.label, st.why]), l.takeaway);
          break;
        case 3:
          parts.push(...l.checklist);
          break;
        case 4:
          parts.push(l.toggle.question, l.toggle.why, ...l.slider.stops.map((st) => st.note));
          break;
        case 5:
          parts.push(l.prompt, ...l.options.flatMap((o) => [o.text, o.reveal]));
          break;
        case 6:
          parts.push(l.buildCard.title, l.buildCard.deliverable, ...l.buildCard.acceptance);
          break;
      }
      return parts.join(" ");
    })
    .join(" ");
  return `${s.oneLiner} ${levels}`.replace(/\s+/g, " ").trim();
}

let cache: SearchDoc[] | null = null;

// One flat list of everything searchable. Built once per runtime — the
// curriculum is static data, so this is effectively a constant.
export function getSearchDocuments(): SearchDoc[] {
  if (cache) return cache;
  const docs: SearchDoc[] = [];

  for (const m of curriculum) {
    docs.push({
      id: `module:${m.slug}`,
      kind: m.type,
      title: m.title,
      icon: m.icon,
      href: `/learn/${m.slug}`,
      meta: `~${m.estimatedMinutes} min`,
      body: moduleBody(m),
    });
  }

  for (const s of stems) {
    docs.push({
      id: `stem:${s.slug}`,
      kind: "stem",
      title: s.title,
      icon: s.icon,
      href: `/stem/${s.slug}`,
      meta: `Deep stem · ${getDomainTitle(s.domainId) ?? s.domainId}`,
      body: stemBody(s),
    });
  }

  for (const d of atlas.domains) {
    docs.push({
      id: `domain:${d.id}`,
      kind: "domain",
      title: d.title,
      icon: d.icon,
      href: d.stemSlug ? `/stem/${d.stemSlug}` : "/atlas",
      meta: "Atlas domain",
      body: `${d.blurb} ${d.createDeliverable}`,
    });
  }

  cache = docs;
  return docs;
}
