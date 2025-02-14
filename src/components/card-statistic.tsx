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

export function CardStatisticSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-1 h-8 w-full animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
