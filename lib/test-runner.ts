import type { LabTest } from "./curriculum/types";

export type TestResult = { name: string; passed: boolean; message: string };

export function runLabTests(tests: LabTest[], code: string, stdout: string): TestResult[] {
  return tests.map((test) => {
    try {
      const passed = test.validate(code, stdout);
      if (passed) {
        return { name: test.name, passed: true, message: "" };
      }
      return { name: test.name, passed: false, message: test.description };
    } catch {
      return { name: test.name, passed: false, message: test.description };
    }
  });
}

export function allPassed(results: TestResult[]): boolean {
  return results.every((result) => result.passed === true);
}
