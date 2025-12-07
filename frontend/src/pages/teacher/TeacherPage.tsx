/**
 * Teacher Main Page - displays list of classrooms
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/widgets/layout/MainLayout";
import { useTeacherClassrooms } from "@/features/teacher-classrooms/model/useTeacherClassrooms";
import { CreateClassroomDialog } from "@/features/create-classroom/ui/CreateClassroomDialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Plus, Users, BookOpen, Code } from "lucide-react";

export default function TeacherPage() {
  const navigate = useNavigate();
  const { classrooms, loading, refetch } = useTeacherClassrooms();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <MainLayout title="Мои классы" footer="full">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Мои классы</h1>
            <p className="text-muted-foreground mt-1">
              Управляйте своими классами, создавайте уроки и домашние задания
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Создать класс
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка классов...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && classrooms.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">У вас пока нет классов</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Создайте первый класс, чтобы начать работу с учениками, создавать уроки и задания
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Создать первый класс
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Classrooms Grid */}
        {!loading && classrooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <Card
                key={classroom.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/teacher/classroom/${classroom.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{classroom.name}</span>
                    <BookOpen className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </CardTitle>
                  <CardDescription>{classroom.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {classroom.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {classroom.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{classroom.students_count || 0} учеников</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Code className="w-4 h-4" />
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">
                          {classroom.invite_code}
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Classroom Dialog */}
        <CreateClassroomDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={refetch}
        />
      </div>
    </MainLayout>
  );
}
