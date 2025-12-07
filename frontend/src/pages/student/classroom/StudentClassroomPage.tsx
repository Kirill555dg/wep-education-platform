/**
 * Student Classroom Page - view lessons and homework
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/widgets/layout/MainLayout";
import { classroomsApi, lessonsApi, type Classroom, type Lesson } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft, BookOpen, FileText, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

export default function StudentClassroomPage() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classroomId) return;

    const fetchData = async () => {
      try {
        const classroomData = await classroomsApi.getById(parseInt(classroomId));
        setClassroom(classroomData);

        const lessonsData = await lessonsApi.getByClassroom(parseInt(classroomId));
        setLessons(lessonsData);
      } catch (error) {
        toast({
          title: "❌ Ошибка",
          description: "Не удалось загрузить класс",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classroomId, toast]);

  if (loading) {
    return (
      <MainLayout title="Загрузка..." footer="full">
        <div className="container mx-auto p-6 text-center">
          <p className="text-muted-foreground">Загрузка класса...</p>
        </div>
      </MainLayout>
    );
  }

  if (!classroom) {
    return (
      <MainLayout title="Класс не найден" footer="full">
        <div className="container mx-auto p-6 text-center">
          <p className="text-muted-foreground mb-4">Класс не найден</p>
          <Button onClick={() => navigate("/student")}>Вернуться к списку</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={classroom.name} footer="full">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/student")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{classroom.name}</h1>
            <p className="text-muted-foreground">{classroom.subject}</p>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Уроки и задания
          </h2>

          {lessons.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Уроков пока нет</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Преподаватель ещё не добавил уроков в этот класс
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <Card 
                  key={lesson.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/student/lesson/${lesson.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {lesson.title}
                    </CardTitle>
                    {lesson.description && (
                      <CardDescription>{lesson.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>Заданий: 0</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Выполнено: 0</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-600">
                        <Clock className="w-4 h-4" />
                        <span>В процессе: 0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

