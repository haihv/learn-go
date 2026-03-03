type Props = {
  completed: number;
  total: number;
};

export default function ProgressBar({ completed, total }: Props) {
  return (
    <div>
      <div className="w-full bg-navy-700 rounded-full h-2">
        <div
          className="bg-go-cyan h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.round((completed / total) * 100)}%` }}
        />
      </div>
      <p className="text-navy-500 text-xs mt-1">
        {completed}/{total} modules
      </p>
    </div>
  );
}
