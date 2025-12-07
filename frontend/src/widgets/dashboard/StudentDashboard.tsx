/**
 * Student Dashboard Widget
 * Shows student progress and achievements
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { GraduationCap, Target, Trophy, TrendingUp, CheckCircle, Clock } from "lucide-react";

interface StudentDashboardProps {
  totalHomework: number;
  completedHomework: number;
  averageScore: number;
  totalClasses: number;
}

export function StudentDashboard({
  totalHomework,
  completedHomework,
  averageScore,
  totalClasses,
}: StudentDashboardProps) {
  const stats = [
    {
      title: "Мои классы",
      value: totalClasses,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Заданий получено",
      value: totalHomework,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Выполнено",
      value: completedHomework,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Средний балл",
      value: averageScore || 0,
      icon: Trophy,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  const completionRate = totalHomework > 0 
    ? Math.round((completedHomework / totalHomework) * 100) 
    : 0;

  const pendingHomework = totalHomework - completedHomework;

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
                    <p className="text-3xl font-bold mt-2">
                      {stat.title === "Средний балл" ? stat.value.toFixed(1) : stat.value}
                    </p>
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

      {/* Progress Card */}
      {totalHomework > 0 && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Мой прогресс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Выполнение заданий</span>
                <Badge 
                  variant={completionRate >= 70 ? "success" : completionRate >= 40 ? "warning" : "destructive"} 
                  className="text-base px-3 py-1"
                >
                  {completionRate}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    completionRate >= 70 ? 'bg-green-600' : completionRate >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {completedHomework} выполнено
                </span>
                {pendingHomework > 0 && (
                  <span className="text-amber-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {pendingHomework} осталось
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivation Messages */}
      {completionRate === 100 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-10 h-10 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Превосходно!</h4>
                <p className="text-sm text-green-700">
                  Вы выполнили все задания! Продолжайте в том же духе!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {pendingHomework > 0 && completionRate < 100 && completionRate >= 50 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Target className="w-10 h-10 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">Почти готово!</h4>
                <p className="text-sm text-blue-700">
                  Осталось совсем немного. Завершите оставшиеся {pendingHomework} задания!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

