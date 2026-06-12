import type { ModuleType } from "@/lib/curriculum/types";

type Props = {
  type: ModuleType;
};

const config: Record<ModuleType, { className: string; label: string }> = {
  lesson: { className: "bg-go-blue/10 text-go-blue border-go-blue/40", label: "LESSON" },
  workshop: { className: "bg-go-purple/10 text-go-purple border-go-purple/40", label: "WORKSHOP" },
  lab: { className: "bg-go-green/10 text-go-green border-go-green/40", label: "LAB" },
};

export default function Badge({ type }: Props) {
  const { className, label } = config[type];
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}
