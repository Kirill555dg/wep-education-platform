import type { ClassroomProgressResponse, Page_StatisticsResponse_, StatisticsResponse, StudentProgressResponse } from "@/shared/api/generated";
import { createRng } from "@/shared/api/mock/prng";
import { env } from "@/shared/config/env";

function mkSeed(scope: string) {
  return `${env.mockSeed}:${scope}`;
}

export function mockStudentProgress(studentUserId: number): StudentProgressResponse {
  const rng = createRng(mkSeed(`student-progress:${studentUserId}`));
  const total = rng.int(0, 24);
  const completed = rng.int(0, total);
  const inProgress = rng.int(0, total - completed);
  const notStarted = Math.max(0, total - completed - inProgress);

  return {
    total_homeworks: total,
    completed,
    in_progress: inProgress,
    not_started: notStarted,
    average_score_percentage: total > 0 ? rng.int(35, 98) : 0,
    total_attempts: total > 0 ? rng.int(total, total * 3) : 0,
    total_time_spent_minutes: total > 0 ? rng.int(total * 10, total * 120) : 0,
  };
}

export function mockClassroomProgress(classroomId: number): ClassroomProgressResponse {
  const rng = createRng(mkSeed(`classroom-progress:${classroomId}`));
  const students = rng.int(5, 35);
  const homeworks = rng.int(1, 25);
  const completed = rng.int(0, students * homeworks);
  const totalAssigned = students * homeworks;
  const avg = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 10000) / 100 : 0;
  return {
    total_students: students,
    total_homeworks_assigned: totalAssigned,
    completed_homeworks: completed,
    average_completion_rate: avg,
  };
}

function mkStatus(rng: ReturnType<typeof createRng>) {
  return rng.pick(["not_started", "in_progress", "submitted", "completed"]);
}

function mkStatsRow(rng: ReturnType<typeof createRng>, id: number, studentId: number, homeworkId: number): StatisticsResponse {
  const max = rng.int(5, 100);
  const score = rng.int(0, max);
  const status = mkStatus(rng);
  const now = Date.now();
  const createdAt = new Date(now - rng.int(1, 30) * 86_400_000).toISOString();
  const updatedAt = new Date(now - rng.int(0, 5) * 86_400_000).toISOString();
  const submittedAt = status === "submitted" || status === "completed" ? new Date(now - rng.int(0, 5) * 86_400_000).toISOString() : null;
  const gradedAt = status === "completed" ? new Date(now - rng.int(0, 3) * 86_400_000).toISOString() : null;

  return {
    id,
    student_id: studentId,
    homework_id: homeworkId,
    status,
    score,
    max_score: max,
    attempts_count: rng.int(1, 5),
    time_spent_minutes: rng.int(5, 120),
    submitted_at: submittedAt,
    graded_at: gradedAt,
    feedback: gradedAt ? rng.pick(["Отлично", "Хорошо", "Нужно аккуратнее", "Проверь вычисления"]) : null,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

export function mockHomeworkStats(homeworkId: number, params: { skip: number; limit: number }): Page_StatisticsResponse_ {
  const rng = createRng(mkSeed(`homework-stats:${homeworkId}`));
  const total = rng.int(10, 60);
  const skip = params.skip;
  const limit = params.limit;
  const end = Math.min(total, skip + limit);
  const items: StatisticsResponse[] = [];
  for (let i = skip; i < end; i++) {
    const studentId = 1000 + (i % 60);
    items.push(mkStatsRow(rng, homeworkId * 10_000 + i + 1, studentId, homeworkId));
  }
  return { items, total, skip, limit };
}

export function mockStudentStats(studentUserId: number, params: { skip: number; limit: number }): Page_StatisticsResponse_ {
  const rng = createRng(mkSeed(`student-stats:${studentUserId}`));
  const total = rng.int(5, 40);
  const skip = params.skip;
  const limit = params.limit;
  const end = Math.min(total, skip + limit);
  const items: StatisticsResponse[] = [];
  for (let i = skip; i < end; i++) {
    const homeworkId = 200 + (i % 40);
    items.push(mkStatsRow(rng, studentUserId * 10_000 + i + 1, studentUserId, homeworkId));
  }
  return { items, total, skip, limit };
}


