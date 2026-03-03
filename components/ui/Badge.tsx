import type { ModuleType } from "@/lib/curriculum/types";

type Props = {
  type: ModuleType;
};

const config: Record<ModuleType, { className: string; label: string }> = {
  lesson: { className: "bg-go-blue/20 text-go-blue", label: "LESSON" },
  workshop: { className: "bg-go-purple/20 text-go-purple", label: "WORKSHOP" },
  lab: { className: "bg-go-green/20 text-go-green", label: "LAB" },
};

export default function Badge({ type }: Props) {
  const { className, label } = config[type];
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}
