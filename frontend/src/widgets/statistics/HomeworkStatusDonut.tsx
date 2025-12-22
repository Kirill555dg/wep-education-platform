import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

import type { StatisticsResponse } from "@/shared/api/generated";

const COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#ef4444", "#6b7280"];

function normalizeStatus(status: string | undefined) {
  const s = (status ?? "unknown").toLowerCase().trim();
  if (!s) return "unknown";
  return s;
}

export function HomeworkStatusDonut(props: { stats: StatisticsResponse[] }) {
  const { stats } = props;

  const counts = new Map<string, number>();
  for (const r of stats) {
    const key = normalizeStatus(r.status);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const data = Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((acc, x) => acc + x.value, 0);
  if (total === 0) return null;

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


