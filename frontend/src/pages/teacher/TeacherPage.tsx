/**
 * Teacher Main Page - displays list of classrooms
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/widgets/layout/MainLayout";
import { TeacherDashboard } from "@/widgets/dashboard";
import { useTeacherClassrooms } from "@/features/teacher-classrooms/model/useTeacherClassrooms";
import { CreateClassroomDialog } from "@/features/create-classroom/ui/CreateClassroomDialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { ClassroomCardSkeleton } from "@/shared/ui/loading-skeleton";
import { Plus, Users, BookOpen, Code, TrendingUp } from "lucide-react";
import { Badge } from "@/shared/ui/badge";

export default function TeacherPage() {
  const navigate = useNavigate();
  const { classrooms, loading, error, refetch } = useTeacherClassrooms();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <MainLayout title="Мои классы" footer="full">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Мои классы
            </h1>
            <p className="text-muted-foreground mt-1">
              Управляйте своими классами, создавайте уроки и домашние задания
            </p>
            {classrooms.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="info" className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {classrooms.length} {classrooms.length === 1 ? 'класс' : 'классов'}
                </Badge>
                <Badge variant="success" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {classrooms.reduce((sum, c) => sum + (c.students_count || 0), 0)} учеников
                </Badge>
              </div>
            )}
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Создать класс
          </Button>
        </div>

        {/* Loading State */}
        {loading && <ClassroomCardSkeleton />}

        {/* Error State */}
        {error && !loading && (
          <ErrorState
            message={error}
            onRetry={refetch}
            variant="card"
          />
        )}

        {/* Empty State */}
        {!loading && !error && classrooms.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="У вас пока нет классов"
            description="Создайте первый класс, чтобы начать работу с учениками, создавать уроки и задания"
            action={{
              label: "Создать первый класс",
              onClick: () => setCreateDialogOpen(true),
            }}
          />
        )}

        {/* Classrooms Grid */}
        {!loading && !error && classrooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <Card
                key={classroom.id}
                className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500"
                onClick={() => navigate(`/teacher/classroom/${classroom.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate group-hover:text-blue-600 transition-colors">
                      {classroom.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {classroom.students_count && classroom.students_count > 0 && (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      )}
                      <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {classroom.subject}
                  </CardDescription>
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
                        <span>{classroom.students_count || 0}</span>
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        <Code className="w-3 h-3 text-muted-foreground" />
                        <code className="bg-gradient-to-r from-blue-100 to-purple-100 px-2 py-1 rounded text-xs font-bold text-blue-900">
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
