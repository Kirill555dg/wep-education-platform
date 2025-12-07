/**
 * Student Homework Page
 * Allows students to view and complete homework
 */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { homeworkApi } from "@/shared/api";
import { useSubmitHomework } from "@/features/submit-homework/model/useSubmitHomework";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import type { Homework, Problem } from "@/shared/api";

export default function StudentHomeworkPage() {
  const { homeworkId } = useParams<{ homeworkId: string }>();
  const { submitAnswer, submitHomework, loading } = useSubmitHomework();

  const [homework, setHomework] = useState<Homework | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!homeworkId) return;

    const fetchHomework = async () => {
      try {
        const hw = await homeworkApi.getById(parseInt(homeworkId));
        setHomework(hw);

        const probs = await homeworkApi.getProblems(parseInt(homeworkId));
        setProblems(probs as Problem[]);
      } catch (error) {
        setMessage("❌ Ошибка загрузки задания");
      }
    };

    fetchHomework();
  }, [homeworkId]);

  const handleAnswerChange = (problemId: number, answer: string) => {
    setAnswers({
      ...answers,
      [problemId]: answer,
    });
  };

  const handleSubmitAnswer = async (problemId: number) => {
    if (!homeworkId || !answers[problemId]) {
      setMessage("❌ Введите ответ");
      return;
    }

    try {
      const stats = await submitAnswer({
        homework_id: parseInt(homeworkId),
        problem_id: problemId,
        answer: answers[problemId],
        time_spent_minutes: 5,
      });

      setMessage(`✅ Ответ отправлен! Текущий балл: ${stats.score}/${stats.max_score}`);
    } catch (error) {
      setMessage("❌ Ошибка отправки ответа");
    }
  };

  const handleFinalSubmit = async () => {
    if (!homeworkId) return;

    try {
      const stats = await submitHomework(parseInt(homeworkId));
      setMessage(`✅ Задание отправлено! Итоговый балл: ${stats.score}/${stats.max_score}`);
    } catch (error) {
      setMessage("❌ Ошибка финальной отправки");
    }
  };

  if (!homework) {
    return <div className="container mx-auto p-6">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{homework.title}</h1>
        {homework.description && (
          <p className="text-gray-600 mt-2">{homework.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Максимальный балл: {homework.max_score}
        </p>
      </div>

      {message && (
        <div className="p-4 rounded bg-gray-100 border">
          {message}
        </div>
      )}

      <div className="space-y-4">
        {problems.map((problem, index) => (
          <Card key={problem.id} className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              Задача {index + 1}: {problem.title}
            </h3>
            <p className="mb-4">{problem.description}</p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Ваш ответ"
                value={answers[problem.id] || ""}
                onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
              />
              <Button
                onClick={() => handleSubmitAnswer(problem.id)}
                disabled={loading}
              >
                Отправить
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button
          onClick={handleFinalSubmit}
          disabled={loading}
          className="w-full"
        >
          Завершить задание
        </Button>
      </div>
    </div>
  );
}

