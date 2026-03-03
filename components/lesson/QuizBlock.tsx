"use client";
import { useState } from "react";
import type { QuizQuestion } from "@/lib/curriculum/types";

type Props = {
  questions: QuizQuestion[];
  onComplete: () => void;
};

export default function QuizBlock({ questions, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    const allCorrect = questions.every((q, i) => answers[i] === q.correctIndex);
    if (allCorrect) onComplete();
  }

  const correctCount = submitted
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;
  const total = questions.length;
  const allCorrect = correctCount === total;

  return (
    <div>
      {questions.map((q, qi) => (
        <div key={qi} className="mb-6">
          <p className="mb-3 font-medium text-navy-500">{q.question}</p>
          <div className="flex flex-col gap-2">
            {q.options.map((option, oi) => {
              const isSelected = answers[qi] === oi;
              const isCorrect = oi === q.correctIndex;
              const isWrongSelected = submitted && isSelected && !isCorrect;

              let styleClasses =
                "border rounded-lg p-3 text-left w-full cursor-pointer bg-navy-800 border-navy-600 text-navy-500";

              if (submitted) {
                styleClasses = "border rounded-lg p-3 text-left w-full cursor-default";
                if (isCorrect) {
                  styleClasses += " bg-go-green/20 border-go-green text-go-green";
                } else if (isWrongSelected) {
                  styleClasses += " bg-go-red/20 border-go-red text-go-red";
                } else {
                  styleClasses += " bg-navy-800 border-navy-600 text-navy-500";
                }
              } else if (isSelected) {
                styleClasses =
                  "border rounded-lg p-3 text-left w-full cursor-pointer bg-navy-800 border-navy-600 text-navy-500 ring-2 ring-go-cyan";
              }

              return (
                <button
                  key={oi}
                  className={styleClasses}
                  onClick={submitted ? undefined : () => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {submitted ? (
        <p className={allCorrect ? "text-go-green" : "text-go-red"}>
          {allCorrect
            ? `${total}/${total} correct — unlocking next module!`
            : `${correctCount}/${total} correct — review the highlighted answers above.`}
        </p>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`rounded-lg px-5 py-2 font-semibold bg-go-cyan text-navy-800 ${!allAnswered ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          Submit Answers
        </button>
      )}
    </div>
  );
}
