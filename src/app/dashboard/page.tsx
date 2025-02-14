export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Tasks"
          value="156"
          trend="+12%"
          trendDirection="up"
        />
        <Card
          title="Completed Tasks"
          value="92"
          trend="+8%"
          trendDirection="up"
        />
        <Card title="Team Members" value="12" trend="+2" trendDirection="up" />
        <Card
          title="Overdue Tasks"
          value="3"
          trend="-2"
          trendDirection="down"
        />
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Task Completion Trend</h2>
        <ChartComponent />
      </div>
    </div>
  );
}
