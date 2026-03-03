"use client";

type RunButtonProps = {
  onRun: () => void;
  isRunning: boolean;
};

export default function RunButton({ onRun, isRunning }: RunButtonProps) {
  return (
    <button
      onClick={onRun}
      disabled={isRunning}
      className={`bg-go-cyan text-navy-950 font-bold px-4 py-2 rounded-lg flex items-center gap-2 ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isRunning ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        "▶ Run"
      )}
    </button>
  );
}
