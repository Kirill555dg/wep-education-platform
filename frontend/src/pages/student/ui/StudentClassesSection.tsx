import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudentDashboard } from "@/widgets/dashboard";
import { useStudentClassrooms } from "@/features/student-classrooms";
import { JoinClassDialog } from "@/features/join-class/ui/JoinClassDialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { ClassroomCardSkeleton } from "@/shared/ui/loading-skeleton";
import { Badge } from "@/shared/ui/badge";
import { Plus, BookOpen, Users, GraduationCap, CheckCircle2 } from "lucide-react";

export const StudentClassesSection = () => {
  const navigate = useNavigate();
  const { classrooms, loading, error, refetch } = useStudentClassrooms();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  return (
    <section className="w-full sm:max-w-7xl mx-auto px-4 sm:px-0 py-4 sm:py-0">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Мои классы
          </h2>
          <p className="text-muted-foreground mt-1">
            Просматривайте уроки и выполняйте домашние задания
          </p>
          {classrooms.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="success" className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {classrooms.length} {classrooms.length === 1 ? 'класс' : 'классов'}
              </Badge>
            </div>
          )}
        </div>
        <Button onClick={() => setJoinDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Присоединиться к классу
        </Button>
      </header>

      {loading && <ClassroomCardSkeleton />}

      {error && !loading && (
        <ErrorState
          message={error}
          onRetry={refetch}
          variant="card"
        />
      )}

      {!loading && !error && classrooms.length === 0 && (
        <EmptyState
          icon={GraduationCap}
          title="Вы пока не присоединились ни к одному классу"
          description="Введите код приглашения, который дал вам преподаватель, чтобы присоединиться к классу"
          action={{
            label: "Присоединиться к классу",
            onClick: () => setJoinDialogOpen(true),
          }}
        />
      )}

      {/* Dashboard - only show when there are classrooms */}
      {!loading && !error && classrooms.length > 0 && (
        <>
          <StudentDashboard
            totalClasses={classrooms.length}
            totalHomework={0} // TODO: Calculate from API
            completedHomework={0} // TODO: Calculate from stats
            averageScore={0} // TODO: Calculate from stats
          />

          <h3 className="text-xl font-semibold mt-8 mb-4">Все классы</h3>
        </>
      )}

      {!loading && !error && classrooms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer border-l-4 border-l-green-500"
              onClick={() => navigate(`/student/classroom/${classroom.id}`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate group-hover:text-green-600 transition-colors">
                    {classroom.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-green-600 transition-colors flex-shrink-0" />
                  </div>
                </CardTitle>
                <CardDescription>{classroom.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classroom.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {classroom.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{classroom.students_count || 0} учеников</span>
                    </Badge>
                    <Badge variant="success" className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      Активен
                    </Badge>
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
