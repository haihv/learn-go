"use client";
import type { TestResult } from "@/lib/test-runner";

type Props = { results: TestResult[] };

export default function TestResults({ results }: Props) {
  if (results.length === 0) return null;

  const allPassed = results.every((r) => r.passed);

  if (allPassed) {
    return (
      <div className="mt-4 p-4 bg-go-green/20 border border-go-green rounded-lg text-go-green font-bold text-center">
        ✅ All tests passed!
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-2">
      {results.map((result, index) =>
        result.passed ? (
          <li
            key={index}
            className="flex items-start gap-2 p-3 bg-go-green/10 border border-go-green/30 rounded-lg"
          >
            <span className="text-go-green mt-0.5">✅</span>
            <span className="text-stone-600">{result.name}</span>
          </li>
        ) : (
          <li
            key={index}
            className="flex items-start gap-2 p-3 bg-go-red/10 border border-go-red/30 rounded-lg"
          >
            <span className="text-go-red mt-0.5">❌</span>
            <div>
              <p className="text-stone-600">{result.name}</p>
              {result.message && (
                <p className="text-go-red text-sm mt-1">{result.message}</p>
              )}
            </div>
          </li>
        )
      )}
    </ul>
  );
}
