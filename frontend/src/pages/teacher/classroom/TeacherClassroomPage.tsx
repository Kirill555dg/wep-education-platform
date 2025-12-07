/**
 * Teacher Classroom Detail Page - manage specific classroom
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/widgets/layout/MainLayout";
import { classroomsApi, lessonsApi, type Classroom, type Lesson } from "@/shared/api";
import { CreateLessonDialog } from "@/features/create-lesson/ui/CreateLessonDialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ArrowLeft, Plus, BookOpen, Users, Code, Calendar } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

export default function TeacherClassroomPage() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLessonOpen, setCreateLessonOpen] = useState(false);

  const fetchData = async () => {
    if (!classroomId) return;

    try {
      const classroomData = await classroomsApi.getById(parseInt(classroomId));
      setClassroom(classroomData);

      const lessonsData = await lessonsApi.getByClassroom(parseInt(classroomId));
      setLessons(lessonsData);
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось загрузить данные класса",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classroomId, toast]);

  const handleLessonCreated = (lessonId: number) => {
    fetchData();
    navigate(`/teacher/lesson/${lessonId}`);
  };

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
          <Button onClick={() => navigate("/teacher")}>Вернуться к списку</Button>
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
            onClick={() => navigate("/teacher")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{classroom.name}</h1>
            <p className="text-muted-foreground">{classroom.subject}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Учеников
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classroom.students_count || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Уроков
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Code className="w-4 h-4" />
                Код класса
              </CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-xl font-mono bg-muted px-3 py-1 rounded">
                {classroom.invite_code}
              </code>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="lessons" className="space-y-4">
          <TabsList>
            <TabsTrigger value="lessons">Уроки</TabsTrigger>
            <TabsTrigger value="students">Ученики</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Уроки</h2>
              <Button onClick={() => setCreateLessonOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Создать урок
              </Button>
            </div>

            {lessons.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Уроков пока нет</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Создайте первый урок для этого класса
                  </p>
                  <Button onClick={() => setCreateLessonOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать урок
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {lessons.map((lesson) => (
                  <Card 
                    key={lesson.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/teacher/lesson/${lesson.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{lesson.title}</span>
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                      </CardTitle>
                      {lesson.description && (
                        <CardDescription>{lesson.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>Домашних заданий: 0</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Список учеников будет доступен в следующей версии
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Настройки класса</CardTitle>
                <CardDescription>Управление настройками класса</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Название</h3>
                  <p className="text-sm text-muted-foreground">{classroom.name}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Предмет</h3>
                  <p className="text-sm text-muted-foreground">{classroom.subject}</p>
                </div>
                {classroom.description && (
                  <div>
                    <h3 className="font-medium mb-2">Описание</h3>
                    <p className="text-sm text-muted-foreground">{classroom.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Lesson Dialog */}
        {classroom && (
          <CreateLessonDialog
            classroomId={classroom.id}
            open={createLessonOpen}
            onOpenChange={setCreateLessonOpen}
            onSuccess={handleLessonCreated}
          />
        )}
      </div>
    </MainLayout>
  );
}

