import { CardStatistic } from "@/components/card-statistic";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStatistic title="Total Tasks" value="" />
        <CardStatistic title="Completed Tasks" value="" />
        <CardStatistic title="Team Members" value="" />
        <CardStatistic title="Overdue Tasks" value="2" />
      </div>
    </div>
  );
}
