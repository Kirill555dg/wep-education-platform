import { Link } from "react-router-dom";

import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import type { StatisticsResponse } from "@/shared/api/generated";

type HeatStudent = { student_id: number; name: string };
type HeatHomework = { id: number; title: string };

function normalizeStatus(status: string | undefined) {
  const s = (status ?? "").toLowerCase().trim();
  if (!s) return "unknown";
  return s;
}

function statusVariant(status: string | undefined): "success" | "warning" | "info" | "destructive" | "secondary" | "outline" {
  const s = normalizeStatus(status);
  if (s === "completed" || s === "submitted" || s === "done") return "success";
  if (s === "in_progress" || s === "progress") return "info";
  if (s === "not_started" || s === "assigned") return "secondary";
  if (s === "failed" || s === "error") return "destructive";
  return "outline";
}

function pctLabel(r: Pick<StatisticsResponse, "score" | "max_score">) {
  const pct = r.max_score > 0 ? Math.round(((r.score ?? 0) / r.max_score) * 100) : 0;
  return `${pct}%`;
}

export function ClassroomHeatTable(props: {
  classroomId: number;
  students: HeatStudent[];
  homeworks: HeatHomework[];
  cells: Record<string, Pick<StatisticsResponse, "status" | "score" | "max_score" | "submitted_at">>;
}) {
  const { classroomId, students, homeworks, cells } = props;

  if (students.length === 0 || homeworks.length === 0) return null;

  return (
    <div className="w-full overflow-auto border rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="border-b">
            <th className="px-3 py-2 text-left font-medium sticky left-0 bg-muted/40">Ученик</th>
            {homeworks.map((h) => (
              <th key={h.id} className="px-3 py-2 text-left font-medium min-w-[160px]">
                <Link className="underline underline-offset-4" to={routes.teacher.homework(h.id)} title={h.title}>
                  {h.title}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.student_id} className="border-b last:border-b-0">
              <td className="px-3 py-2 sticky left-0 bg-background">
                <Link className="underline underline-offset-4" to={routes.teacher.classroomStudentStats(classroomId, s.student_id)}>
                  {s.name}
                </Link>
              </td>
              {homeworks.map((h) => {
                const key = `${s.student_id}:${h.id}`;
                const cell = cells[key];
                if (!cell) {
                  return (
                    <td key={h.id} className="px-3 py-2">
                      <span className="text-muted-foreground">—</span>
                    </td>
                  );
                }
                const title = `status: ${cell.status ?? "unknown"} | score: ${(cell.score ?? 0)}/${cell.max_score}`;
                return (
                  <td key={h.id} className="px-3 py-2">
                    <Badge variant={statusVariant(cell.status)} title={title} className="font-medium">
                      {pctLabel(cell)}
                    </Badge>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


