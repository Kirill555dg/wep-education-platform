import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

import type { StudentProgressResponse } from "@/shared/api/generated";

const COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#6b7280"];

export function StudentProgressChart(props: { data: StudentProgressResponse }) {
  const { data } = props;

  const chartData = [
    { name: "Выполнено", value: data.completed },
    { name: "В процессе", value: data.in_progress },
    { name: "Не начато", value: data.not_started },
  ];

  const total = chartData.reduce((acc, x) => acc + x.value, 0);
  if (total === 0) {
    return (
      <div className="h-56 w-full grid place-items-center rounded-md border bg-muted/10">
        <div className="text-sm text-muted-foreground">Пока нет данных для графика</div>
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


