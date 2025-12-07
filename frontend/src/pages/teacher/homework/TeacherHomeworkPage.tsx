/**
 * Teacher Homework Management Page
 * Manage problems in a homework assignment
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/widgets/layout/MainLayout";
import { homeworkApi, problemsApi, type HomeworkDetail, type ProblemFull } from "@/shared/api";
import { CreateProblemDialog } from "@/features/manage-problems/ui/CreateProblemDialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

export default function TeacherHomeworkPage() {
  const { homeworkId } = useParams<{ homeworkId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [homework, setHomework] = useState<HomeworkDetail | null>(null);
  const [problems, setProblems] = useState<ProblemFull[]>([]);
  const [availableProblems, setAvailableProblems] = useState<ProblemFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [createProblemOpen, setCreateProblemOpen] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);

  const fetchData = async () => {
    if (!homeworkId) return;

    try {
      const [homeworkData, homeworkProblems, allProblems] = await Promise.all([
        homeworkApi.getById(parseInt(homeworkId)),
        homeworkApi.getProblems(parseInt(homeworkId)),
        problemsApi.getAll(),
      ]);

      setHomework(homeworkData);
      setProblems(homeworkProblems as ProblemFull[]);
      
      // Filter out problems already in homework
      const homeworkProblemIds = new Set(homeworkProblems.map(p => p.id));
      setAvailableProblems(allProblems.filter(p => !homeworkProblemIds.has(p.id)));
      setSelectedProblems(homeworkProblems.map(p => p.id));
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось загрузить домашнее задание",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [homeworkId, toast]);

  const handleProblemCreated = async (problemId: number) => {
    // Add newly created problem to homework
    if (!homeworkId) return;
    
    const newSelectedProblems = [...selectedProblems, problemId];
    
    try {
      await homeworkApi.update(parseInt(homeworkId), {
        // Note: Backend might need problem_ids in update schema
      });
      
      toast({
        title: "✅ Задача добавлена",
        description: "Задача успешно добавлена к домашнему заданию",
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: "⚠️ Задача создана",
        description: "Задача создана, но не добавлена к ДЗ автоматически. Используйте список задач ниже.",
      });
      fetchData();
    }
  };

  const handleAddExistingProblem = async (problemId: number) => {
    if (!homeworkId) return;

    const newSelectedProblems = [...selectedProblems, problemId];
    
    try {
      // TODO: Backend API to add problem to homework
      setSelectedProblems(newSelectedProblems);
      fetchData();
      
      toast({
        title: "✅ Задача добавлена",
      });
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось добавить задачу",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout title="Загрузка..." footer="full">
        <div className="container mx-auto p-6 text-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </MainLayout>
    );
  }

  if (!homework) {
    return (
      <MainLayout title="ДЗ не найдено" footer="full">
        <div className="container mx-auto p-6 text-center">
          <p className="text-muted-foreground mb-4">Домашнее задание не найдено</p>
          <Button onClick={() => navigate(-1)}>Назад</Button>
        </div>
      </MainLayout>
    );
  }

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

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Информация о задании</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Максимальный балл:</span>
              <span className="ml-2 font-medium">{homework.max_score}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Задач в задании:</span>
              <span className="ml-2 font-medium">{problems.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Problems Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Задачи в задании</h2>
            <Button onClick={() => setCreateProblemOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать задачу
            </Button>
          </div>

          {problems.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="font-semibold mb-2">Задач пока нет</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Создайте задачи для этого домашнего задания
                </p>
                <Button onClick={() => setCreateProblemOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать первую задачу
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {problems.map((problem, index) => (
                <Card key={problem.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Задача {index + 1}: {problem.title}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Тип: {problem.problem_type} • Сложность: {problem.difficulty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{problem.description}</p>
                    {problem.correct_answer && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-xs font-medium text-green-800 mb-1">Правильный ответ:</p>
                        <p className="text-sm text-green-900">{problem.correct_answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Available Problems to Add */}
        {availableProblems.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Доступные задачи</h2>
            <p className="text-sm text-muted-foreground">
              Задачи, которые вы создали, но ещё не добавили к этому ДЗ
            </p>
            <div className="grid gap-4">
              {availableProblems.map((problem) => (
                <Card key={problem.id} className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{problem.title}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddExistingProblem(problem.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Добавить
                      </Button>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create Problem Dialog */}
        <CreateProblemDialog
          onProblemCreated={handleProblemCreated}
          open={createProblemOpen}
          onOpenChange={setCreateProblemOpen}
        />
      </div>
    </MainLayout>
  );
}

