/**
 * Teacher Lesson Page - manage homework and materials
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/widgets/layout/MainLayout";
import { lessonsApi, homeworkApi, type LessonDetail, type Homework } from "@/shared/api";
import { CreateHomeworkDialog } from "@/features/create-homework/ui/CreateHomeworkDialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft, Plus, BookOpen, FileText, BarChart } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

export default function TeacherLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [createHomeworkOpen, setCreateHomeworkOpen] = useState(false);

  const fetchHomeworks = async () => {
    if (!lessonId) return;
    try {
      const homeworksData = await homeworkApi.getByLesson(parseInt(lessonId));
      setHomeworks(homeworksData);
    } catch (error) {
      console.error("Failed to fetch homeworks", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить домашние задания",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!lessonId) return;

    const fetchData = async () => {
      try {
        const lessonData = await lessonsApi.getById(parseInt(lessonId));
        setLesson(lessonData);
        
        await fetchHomeworks();
      } catch (error) {
        toast({
          title: "❌ Ошибка",
          description: "Не удалось загрузить урок",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, toast]);

  const handleHomeworkCreated = (homeworkId: number) => {
    fetchHomeworks();
    // Could also navigate to homework page: navigate(`/teacher/homework/${homeworkId}`)
  };

  if (loading) {
    return (
      <MainLayout title="Загрузка..." footer="full">
        <div className="container mx-auto p-6 text-center">
          <p className="text-muted-foreground">Загрузка урока...</p>
        </div>
      </MainLayout>
    );
  }

  if (!lesson) {
    return (
      <MainLayout title="Урок не найден" footer="full">
        <div className="container mx-auto p-6 text-center">
          <p className="text-muted-foreground mb-4">Урок не найден</p>
          <Button onClick={() => navigate(-1)}>Назад</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={lesson.title} footer="full">
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
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-muted-foreground mt-1">{lesson.description}</p>
            )}
          </div>
        </div>

        {/* Homework Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Домашние задания
            </h2>
            <Button onClick={() => setCreateHomeworkOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать ДЗ
            </Button>
          </div>

          {homeworks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Домашних заданий пока нет</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Создайте первое домашнее задание для этого урока
                </p>
                <Button onClick={() => setCreateHomeworkOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать ДЗ
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {homeworks.map((homework) => (
                <Card 
                  key={homework.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/teacher/homework/${homework.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{homework.title}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <BarChart className="w-4 h-4 mr-1" />
                          Статистика
                        </Button>
                      </div>
                    </CardTitle>
                    {homework.description && (
                      <CardDescription>{homework.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Задач: {homework.problems_count || 0}</span>
                      <span>Сдано: {homework.completed_count || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Create Homework Dialog */}
        {lesson && (
          <CreateHomeworkDialog
            lessonId={lesson.id}
            open={createHomeworkOpen}
            onOpenChange={setCreateHomeworkOpen}
            onSuccess={handleHomeworkCreated}
          />
        )}
      </div>
    </MainLayout>
  );
}

