import { intro } from "./modules/01-intro";
import { variables } from "./modules/02-variables";
import { variablesLab } from "./modules/03-variables-lab";
import { pointers } from "./modules/04-pointers";
import { pointersWorkshop } from "./modules/05-pointers-workshop";
import { functions } from "./modules/06-functions";
import { functionsWorkshop } from "./modules/07-functions-workshop";
import { closures } from "./modules/08-closures";
import { closuresWorkshop } from "./modules/09-closures-workshop";
import { functionsLab } from "./modules/10-functions-lab";
import { controlFlow } from "./modules/11-control-flow";
import { slices } from "./modules/12-slices";
import { slicesLab } from "./modules/13-slices-lab";
import { maps } from "./modules/14-maps";
import { mapsLab } from "./modules/15-maps-lab";
import { structs } from "./modules/16-structs";
import { structsWorkshop } from "./modules/17-structs-workshop";
import { structsLab } from "./modules/18-structs-lab";
import { interfaces } from "./modules/19-interfaces";
import { interfacesWorkshop } from "./modules/20-interfaces-workshop";
import { interfacesLab } from "./modules/21-interfaces-lab";
import { errorHandling } from "./modules/22-error-handling";
import { errorHandlingWorkshop } from "./modules/23-error-handling-workshop";
import { errorHandlingLab } from "./modules/24-error-handling-lab";
import { deferPanicRecover } from "./modules/25-defer-panic-recover";
import { stringsRunes } from "./modules/26-strings-runes";
import { jsonEncoding } from "./modules/27-json-encoding";
import { jsonWorkshop } from "./modules/28-json-workshop";
import { jsonLab } from "./modules/29-json-lab";
import { goroutines } from "./modules/30-goroutines";
import { goroutinesWorkshop } from "./modules/31-goroutines-workshop";
import { generics } from "./modules/32-generics";
import { httpBasics } from "./modules/33-http-basics";
import { httpWorkshop } from "./modules/34-http-workshop";
import { httpLab } from "./modules/35-http-lab";
import type { CourseModule } from "./types";

export const curriculum: CourseModule[] = [
  // Block 1: Foundations
  intro, variables, variablesLab,
  pointers, pointersWorkshop,
  // Block 2: Functions & Closures
  functions, functionsWorkshop,
  closures, closuresWorkshop,
  functionsLab,
  // Block 3: Control Flow & Collections
  controlFlow, slices, slicesLab,
  maps, mapsLab,
  // Block 4: Type System
  structs, structsWorkshop, structsLab,
  interfaces, interfacesWorkshop, interfacesLab,
  // Block 5: Error Handling & Resilience
  errorHandling, errorHandlingWorkshop, errorHandlingLab,
  deferPanicRecover,
  // Block 6: Strings & JSON
  stringsRunes, jsonEncoding, jsonWorkshop, jsonLab,
  // Block 7: Concurrency & Generics
  goroutines, goroutinesWorkshop, generics,
  // Block 8: HTTP
  httpBasics, httpWorkshop, httpLab,
];

export function getModuleBySlug(slug: string): CourseModule | undefined {
  return curriculum.find((m) => m.slug === slug);
}

export function getModuleIndex(slug: string): number {
  return curriculum.findIndex((m) => m.slug === slug);
}
