import { intro } from "./modules/01-intro";
import { basicTypes } from "./modules/01b-basic-types";
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
import { controlFlowWorkshop } from "./modules/12-control-flow-workshop";
import { arrays } from "./modules/12b-arrays";
import { slices } from "./modules/13-slices";
import { slicesLab } from "./modules/14-slices-lab";
import { maps } from "./modules/15-maps";
import { mapsLab } from "./modules/16-maps-lab";
import { structs } from "./modules/17-structs";
import { structsWorkshop } from "./modules/18-structs-workshop";
import { structsLab } from "./modules/19-structs-lab";
import { interfaces } from "./modules/20-interfaces";
import { interfacesWorkshop } from "./modules/21-interfaces-workshop";
import { interfacesLab } from "./modules/22-interfaces-lab";
import { ioReader } from "./modules/22b-io-reader";
import { errorHandling } from "./modules/23-error-handling";
import { errorHandlingWorkshop } from "./modules/24-error-handling-workshop";
import { errorHandlingLab } from "./modules/25-error-handling-lab";
import { deferPanicRecover } from "./modules/26-defer-panic-recover";
import { deferPanicRecoverWorkshop } from "./modules/27-defer-panic-recover-workshop";
import { stringsRunes } from "./modules/28-strings-runes";
import { stringsRunesWorkshop } from "./modules/29-strings-runes-workshop";
import { jsonEncoding } from "./modules/30-json-encoding";
import { jsonWorkshop } from "./modules/31-json-workshop";
import { jsonLab } from "./modules/32-json-lab";
import { goroutines } from "./modules/33-goroutines";
import { goroutinesWorkshop } from "./modules/34-goroutines-workshop";
import { generics } from "./modules/35-generics";
import { genericsWorkshop } from "./modules/36-generics-workshop";
import { httpBasics } from "./modules/37-http-basics";
import { httpWorkshop } from "./modules/38-http-workshop";
import { httpLab } from "./modules/39-http-lab";
import type { CourseModule } from "./types";

export const curriculum: CourseModule[] = [
  // Block 1: Foundations
  intro, basicTypes, variables, variablesLab,
  pointers, pointersWorkshop,
  // Block 2: Functions & Closures
  functions, functionsWorkshop,
  closures, closuresWorkshop,
  functionsLab,
  // Block 3: Control Flow & Collections
  controlFlow, controlFlowWorkshop,
  arrays,
  slices, slicesLab,
  maps, mapsLab,
  // Block 4: Type System
  structs, structsWorkshop, structsLab,
  interfaces, interfacesWorkshop, interfacesLab,
  ioReader,
  // Block 5: Error Handling & Resilience
  errorHandling, errorHandlingWorkshop, errorHandlingLab,
  deferPanicRecover, deferPanicRecoverWorkshop,
  // Block 6: Strings & JSON
  stringsRunes, stringsRunesWorkshop,
  jsonEncoding, jsonWorkshop, jsonLab,
  // Block 7: Concurrency & Generics
  goroutines, goroutinesWorkshop,
  generics, genericsWorkshop,
  // Block 8: HTTP
  httpBasics, httpWorkshop, httpLab,
];

export function getModuleBySlug(slug: string): CourseModule | undefined {
  return curriculum.find((m) => m.slug === slug);
}

export function getModuleIndex(slug: string): number {
  return curriculum.findIndex((m) => m.slug === slug);
}
