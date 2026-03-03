import { intro } from "./modules/01-intro";
import { variables } from "./modules/02-variables";
import { variablesLab } from "./modules/03-variables-lab";
import { functions } from "./modules/04-functions";
import { functionsWorkshop } from "./modules/05-functions-workshop";
import { functionsLab } from "./modules/06-functions-lab";
import { controlFlow } from "./modules/07-control-flow";
import { slices } from "./modules/08-slices";
import { maps } from "./modules/09-maps";
import { structs } from "./modules/10-structs";
import { interfaces } from "./modules/11-interfaces";
import { goroutines } from "./modules/12-goroutines";
import type { CourseModule } from "./types";

export const curriculum: CourseModule[] = [
  intro, variables, variablesLab,
  functions, functionsWorkshop, functionsLab,
  controlFlow, slices, maps,
  structs, interfaces, goroutines,
];

export function getModuleBySlug(slug: string): CourseModule | undefined {
  return curriculum.find((m) => m.slug === slug);
}

export function getModuleIndex(slug: string): number {
  return curriculum.findIndex((m) => m.slug === slug);
}
