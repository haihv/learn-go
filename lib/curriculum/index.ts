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
import { testing } from "./modules/40-testing";
import { testingWorkshop } from "./modules/41-testing-workshop";
import { testingLab } from "./modules/42-testing-lab";
import { contextModule } from "./modules/43-context";
import { contextWorkshop } from "./modules/44-context-workshop";
import { fileIO } from "./modules/45-file-io";
import { fileIOWorkshop } from "./modules/46-file-io-workshop";
import { fileIOLab } from "./modules/47-file-io-lab";
import { timeSync } from "./modules/48-time-sync";
import { timeSyncWorkshop } from "./modules/49-time-sync-workshop";
import { concurrencyPatterns } from "./modules/50-concurrency-patterns";
import { concurrencyPatternsWorkshop } from "./modules/51-concurrency-patterns-workshop";
import { slog } from "./modules/52-slog";
import { slogWorkshop } from "./modules/53-slog-workshop";
import { modulesPackages } from "./modules/54-modules-packages";
import { modulesPackagesWorkshop } from "./modules/55-modules-packages-workshop";
import { cliFlags } from "./modules/56-cli-flags";
import { cliFlagsWorkshop } from "./modules/57-cli-flags-workshop";
import { databaseSQL } from "./modules/58-database-sql";
import { databaseSQLWorkshop } from "./modules/59-database-sql-workshop";
import { databaseSQLLab } from "./modules/60-database-sql-lab";
import { gracefulShutdown } from "./modules/61-graceful-shutdown";
import { gracefulShutdownWorkshop } from "./modules/62-graceful-shutdown-workshop";
import { embedding } from "./modules/63-embedding";
import { embeddingWorkshop } from "./modules/64-embedding-workshop";
import { typeAssertions } from "./modules/65-type-assertions";
import { typeAssertionsWorkshop } from "./modules/66-type-assertions-workshop";
import { httpMiddleware } from "./modules/67-http-middleware";
import { httpMiddlewareWorkshop } from "./modules/68-http-middleware-workshop";
import { httpMiddlewareLab } from "./modules/69-http-middleware-lab";
import { httpClient } from "./modules/70-http-client";
import { httpClientWorkshop } from "./modules/71-http-client-workshop";
import { benchmarking } from "./modules/72-benchmarking";
import { benchmarkingWorkshop } from "./modules/73-benchmarking-workshop";
import { syncAtomic } from "./modules/74-sync-atomic";
import { syncAtomicWorkshop } from "./modules/75-sync-atomic-workshop";
import { strconvModule } from "./modules/76-strconv";
import { strconvWorkshop } from "./modules/77-strconv-workshop";
import { profiling } from "./modules/78-profiling";
import { profilingWorkshop } from "./modules/79-profiling-workshop";
import { sortModule } from "./modules/80-sort";
import { sortWorkshop } from "./modules/81-sort-workshop";
import { regexpModule } from "./modules/82-regexp";
import { regexpWorkshop } from "./modules/83-regexp-workshop";
import { raceDetector } from "./modules/84-race-detector";
import { raceDetectorWorkshop } from "./modules/85-race-detector-workshop";
import { errorWrapping } from "./modules/86-error-wrapping";
import { errorWrappingWorkshop } from "./modules/87-error-wrapping-workshop";
import { osExec } from "./modules/88-os-exec";
import { osExecWorkshop } from "./modules/89-os-exec-workshop";
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
  // Block 9: Testing
  testing, testingWorkshop, testingLab,
  // Block 10: context
  contextModule, contextWorkshop,
  // Block 11: File I/O
  fileIO, fileIOWorkshop, fileIOLab,
  // Block 12: time + sync
  timeSync, timeSyncWorkshop,
  // Block 13: Concurrency patterns
  concurrencyPatterns, concurrencyPatternsWorkshop,
  // Block 14: Structured logging
  slog, slogWorkshop,
  // Block 15: Go Modules & Packages
  modulesPackages, modulesPackagesWorkshop,
  // Block 16: CLI Flags & Env Vars
  cliFlags, cliFlagsWorkshop,
  // Block 17: database/sql
  databaseSQL, databaseSQLWorkshop, databaseSQLLab,
  // Block 18: Graceful Shutdown
  gracefulShutdown, gracefulShutdownWorkshop,
  // Block 19: Struct Embedding
  embedding, embeddingWorkshop,
  // Block 20: Type Assertions & Switches
  typeAssertions, typeAssertionsWorkshop,
  // Block 21: HTTP Middleware
  httpMiddleware, httpMiddlewareWorkshop, httpMiddlewareLab,
  // Block 22: HTTP Client
  httpClient, httpClientWorkshop,
  // Block 23: Benchmarking
  benchmarking, benchmarkingWorkshop,
  // Block 24: sync/atomic
  syncAtomic, syncAtomicWorkshop,
  // Block 25: strconv
  strconvModule, strconvWorkshop,
  // Block 26: Profiling
  profiling, profilingWorkshop,
  // Block 27: sort
  sortModule, sortWorkshop,
  // Block 28: regexp
  regexpModule, regexpWorkshop,
  // Block 29: Race Detector
  raceDetector, raceDetectorWorkshop,
  // Block 30: Error Wrapping & Sentinel Errors
  errorWrapping, errorWrappingWorkshop,
  // Block 31: os/exec
  osExec, osExecWorkshop,
];

export function getModuleBySlug(slug: string): CourseModule | undefined {
  return curriculum.find((m) => m.slug === slug);
}

export function getModuleIndex(slug: string): number {
  return curriculum.findIndex((m) => m.slug === slug);
}
