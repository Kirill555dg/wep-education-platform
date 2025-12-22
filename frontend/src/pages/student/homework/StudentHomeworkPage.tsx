/**
 * Student Homework Page
 * Allows students to view and complete homework assignments
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/widgets/layout/MainLayout";
import { useViewHomework } from "@/features/view-homework/model/useViewHomework";
import { useSubmitHomework } from "@/features/submit-homework/model/useSubmitHomework";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft, Send, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

export default function StudentHomeworkPage() {
  const { homeworkId } = useParams<{ homeworkId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const parsedHomeworkId = homeworkId ? parseInt(homeworkId) : null;
  
  const { homework, problems, loading: loadingHomework, error: homeworkError } = useViewHomework(parsedHomeworkId);
  const { submitAnswer, loading } = useSubmitHomework();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submittedProblems, setSubmittedProblems] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Load saved answers from localStorage
    if (parsedHomeworkId) {
      const saved = localStorage.getItem(`homework_${parsedHomeworkId}_answers`);
      if (saved) {
        try {
          setAnswers(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load saved answers", e);
        }
      }
    }
  }, [parsedHomeworkId]);

  const handleAnswerChange = (problemId: number, answer: string) => {
    const newAnswers = {
      ...answers,
      [problemId]: answer,
    };
    setAnswers(newAnswers);

    // Auto-save to localStorage
    if (parsedHomeworkId) {
      localStorage.setItem(`homework_${parsedHomeworkId}_answers`, JSON.stringify(newAnswers));
    }
  };

  const handleSubmitAnswer = async (problemId: number) => {
    if (!parsedHomeworkId || !answers[problemId]) {
      toast({
        title: "❌ Ошибка",
        description: "Введите ответ перед отправкой",
        variant: "destructive",
      });
      return;
    }

    try {
      const stats = await submitAnswer({
        homework_id: parsedHomeworkId,
        problem_id: problemId,
        answer: answers[problemId],
        time_spent_minutes: 5,
      });

      setSubmittedProblems(new Set([...submittedProblems, problemId]));
      
      toast({
        title: "✅ Ответ отправлен!",
        description: `Текущий балл: ${stats.score}/${stats.max_score}`,
      });
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось отправить ответ",
        variant: "destructive",
      });
    }
  };

  if (loadingHomework) {
    return (
      <MainLayout title="Загрузка..." footer="full">
        <div className="container mx-auto p-6 text-center">
          <p className="text-muted-foreground">Загрузка задания...</p>
        </div>
      </MainLayout>
    );
  }

  if (homeworkError || !homework) {
    return (
      <MainLayout title="Задание не найдено" footer="full">
        <div className="container mx-auto p-6 text-center">
          <p className="text-muted-foreground mb-4">{homeworkError || "Задание не найдено"}</p>
          <Button onClick={() => navigate(-1)}>Назад</Button>
        </div>
      </MainLayout>
    );
  }

  const totalProblems = problems.length;
  const answeredProblems = Object.keys(answers).length;
  const submittedCount = submittedProblems.size;

  return (
    <MainLayout title={homework.title} footer="full">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{homework.title}</h1>
            {homework.description && (
              <p className="text-muted-foreground mt-1">{homework.description}</p>
            )}
          </div>
        </div>

        {/* Progress Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Прогресс выполнения</span>
              <span className="text-sm font-normal text-muted-foreground">
                Максимальный балл: {homework.max_score}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Всего задач:</span>
                <span className="ml-2 font-medium">{totalProblems}</span>
              </div>
              <div>
                <span className="text-muted-foreground">С ответами:</span>
                <span className="ml-2 font-medium">{answeredProblems}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Отправлено:</span>
                <span className="ml-2 font-medium text-green-600">{submittedCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problems */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Задачи</h2>
          
          {problems.map((problem, index) => {
            const isAnswered = !!answers[problem.id];
            const isSubmitted = submittedProblems.has(problem.id);

            return (
              <Card key={problem.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Задача {index + 1}: {problem.title}</span>
                    {isSubmitted && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-normal">
                        <Check className="w-4 h-4" />
                        Отправлено
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription> </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{problem.description}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ваш ответ:</label>
                    <Textarea
                      placeholder="Введите ваш ответ..."
                      value={answers[problem.id] || ""}
                      onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                      rows={4}
                      disabled={isSubmitted}
                    />
                    {!isSubmitted && isAnswered && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Ответ автоматически сохранён
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => handleSubmitAnswer(problem.id)}
                    disabled={loading || !isAnswered || isSubmitted}
                    className="w-full"
                  >
                    {loading ? (
                      "Отправка..."
                    ) : isSubmitted ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Отправлено
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Отправить ответ
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        {submittedCount === totalProblems && totalProblems > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-4 py-6">
              <Check className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Все задачи выполнены!</h3>
                <p className="text-sm text-green-700">
                  Вы отправили ответы на все {totalProblems} задач
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
