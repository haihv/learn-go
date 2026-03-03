type Props = {
  steps: number;
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
};

export default function StepProgress({ steps, currentStep, completedSteps, onStepClick }: Props) {
  return (
    <div className="flex gap-3 items-center">
      {Array.from({ length: steps }, (_, i) => (
        <div key={i} className="flex gap-3 items-center flex-1 last:flex-none">
          {completedSteps.includes(i) ? (
            <button
              className="w-8 h-8 rounded-full bg-go-green text-navy-950 flex items-center justify-center text-sm font-bold hover:opacity-75 transition-opacity"
              onClick={() => onStepClick?.(i)}
              title={`Review step ${i + 1}`}
            >
              ✓
            </button>
          ) : i === currentStep ? (
            <div className="w-8 h-8 rounded-full border-2 border-go-cyan text-go-cyan flex items-center justify-center text-sm font-bold">
              {i + 1}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-navy-700 text-navy-500 flex items-center justify-center text-sm">
              {i + 1}
            </div>
          )}
          {i < steps - 1 && <div className="flex-1 h-0.5 bg-navy-600" />}
        </div>
      ))}
    </div>
  );
}
