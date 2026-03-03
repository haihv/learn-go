// Stub — replaced in Phase 1 (Subagent 1-B)
import type { LabTest } from "./curriculum/types";

export type TestResult = {
  name: string;
  passed: boolean;
  message: string;
};

export function runLabTests(
  _tests: LabTest[],
  _code: string,
  _stdout: string
): TestResult[] {
  return [];
}

export function allPassed(_results: TestResult[]): boolean {
  return false;
}
