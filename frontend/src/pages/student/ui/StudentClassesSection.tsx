import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentClassrooms } from "@/features/student-classrooms";
import { JoinClassDialog } from "@/features/join-class/ui/JoinClassDialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Plus, BookOpen, Users } from "lucide-react";

export const StudentClassesSection = () => {
  const navigate = useNavigate();
  const { classrooms, loading, refetch } = useStudentClassrooms();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  return (
    <section className="w-full sm:max-w-7xl mx-auto px-4 sm:px-0 py-4 sm:py-0">
      <header className="flex flex-wrap justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Мои классы</h2>
          <p className="text-muted-foreground mt-1">
            Просматривайте уроки и выполняйте домашние задания
          </p>
        </div>
        <Button onClick={() => setJoinDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Присоединиться к классу
        </Button>
      </header>

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Загрузка классов...</p>
        </div>
      )}

      {!loading && classrooms.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Вы пока не присоединились ни к одному классу</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Введите код приглашения, который дал вам преподаватель, чтобы присоединиться к классу
            </p>
            <Button onClick={() => setJoinDialogOpen(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Присоединиться к классу
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && classrooms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/student/classroom/${classroom.id}`)}
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <JoinClassDialog 
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onSuccess={() => {
          setJoinDialogOpen(false);
          refetch();
        }}
      />
    </section>
  );
};
