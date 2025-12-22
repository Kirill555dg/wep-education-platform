import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis } from "recharts";

export type HomeworkScorePoint = {
  name: string;
  value: number; // percent 0..100
};

export function HomeworkScoresBarChart(props: { data: HomeworkScorePoint[] }) {
  const { data } = props;
  if (data.length === 0) return null;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 12, right: 12 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


