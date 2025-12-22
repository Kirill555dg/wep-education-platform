import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis } from "recharts";

export type TeacherStudentRankingPoint = {
  name: string;
  value: number;
};

export function TeacherStudentRankingChart(props: { data: TeacherStudentRankingPoint[]; title?: string }) {
  const { data } = props;
  if (data.length === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 12, right: 12 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


