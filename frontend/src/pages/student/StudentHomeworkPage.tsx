import { Link, useNavigate, useParams } from "react-router-dom";

import { getErrorMessage } from "@/shared/api";
import { useHomeworkProblemsQuery, useHomeworkQuery } from "@/entities/homework/api/queries";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { HomeworkPlayer } from "@/features/homework/player/ui/HomeworkPlayer";

export function StudentHomeworkPage() {
  const navigate = useNavigate();
  const params = useParams();
  const homeworkId = Number(params.homeworkId);

  const hwQuery = useHomeworkQuery(homeworkId);
  const problemsQuery = useHomeworkProblemsQuery(homeworkId);

  if (!Number.isFinite(homeworkId)) {
    navigate(routes.student.home, { replace: true });
    return null;
  }

  if (hwQuery.isLoading || problemsQuery.isLoading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (hwQuery.error) return <div className="text-sm text-destructive">{getErrorMessage(hwQuery.error)}</div>;
  if (problemsQuery.error) return <div className="text-sm text-destructive">{getErrorMessage(problemsQuery.error)}</div>;

  const hw = hwQuery.data!;
  const problems = (problemsQuery.data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    problem_type: p.problem_type,
  }));

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to={routes.student.lesson(hw.lesson_id)}>К уроку</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={routes.student.home}>На главную</Link>
          </Button>
        </div>
      </div>

      <HomeworkPlayer homeworkId={homeworkId} title={hw.title} problems={problems} />
    </div>
  );
}


