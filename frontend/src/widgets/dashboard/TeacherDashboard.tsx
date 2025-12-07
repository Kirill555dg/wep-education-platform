/**
 * Teacher Dashboard Widget
 * Shows quick overview and statistics
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Users, BookOpen, CheckCircle, TrendingUp, Award, Clock } from "lucide-react";

interface TeacherDashboardProps {
  totalClasses: number;
  totalStudents: number;
  totalHomework: number;
  completedHomework: number;
}

export function TeacherDashboard({
  totalClasses,
  totalStudents,
  totalHomework,
  completedHomework,
}: TeacherDashboardProps) {
  const stats = [
    {
      title: "Всего классов",
      value: totalClasses,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Учеников",
      value: totalStudents,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Заданий выдано",
      value: totalHomework,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Выполнено",
      value: completedHomework,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  const completionRate = totalHomework > 0 
    ? Math.round((completedHomework / totalHomework) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Card */}
      {totalHomework > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Общая успеваемость
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Процент выполнения</span>
                <Badge variant={completionRate >= 70 ? "success" : "warning"} className="text-base px-3 py-1">
                  {completionRate}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    completionRate >= 70 ? 'bg-green-600' : 'bg-yellow-600'
                  }`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {completedHomework} из {totalHomework} заданий выполнено студентами
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Hint */}
      {completionRate >= 80 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Award className="w-10 h-10 text-amber-600" />
              <div>
                <h4 className="font-semibold text-amber-900">Отличная работа!</h4>
                <p className="text-sm text-amber-700">
                  Ваши студенты показывают высокий уровень активности
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

