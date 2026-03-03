// Stub — orchestrator fills this in after all Phase 2 subagents complete
import type { CourseModule } from "./types";

export const curriculum: CourseModule[] = [];

export function getModuleBySlug(_slug: string): CourseModule | undefined {
  return undefined;
}

export function getModuleIndex(_slug: string): number {
  return -1;
}
