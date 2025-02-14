interface CardStatisticProps {
  title: string;
  value: string;
}

export function CardStatistic({ title, value }: CardStatisticProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="truncate text-sm font-medium text-gray-500">
              {title}
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
