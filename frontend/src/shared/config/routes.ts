export const routes = {
  login: "/login",
  register: "/register",
  app: "/",
  chat: "/chat",

  teacher: {
    home: "/teacher",
    classroom: (id: number | string) => `/teacher/classrooms/${id}`,
    classroomSettings: (id: number | string) => `/teacher/classrooms/${id}/settings`,
    lesson: (id: number | string) => `/teacher/lessons/${id}`,
    homework: (id: number | string) => `/teacher/homeworks/${id}`,
    homeworkNewForLesson: (lessonId: number | string) => `/teacher/lessons/${lessonId}/homeworks/new`,
    problems: "/teacher/problems",
    problemNew: "/teacher/problems/new",
    problem: (id: number | string) => `/teacher/problems/${id}`,
    stats: "/teacher/stats",
    classroomStats: (id: number | string) => `/teacher/stats/classrooms/${id}`,
  },

  student: {
    home: "/student",
    classroom: (id: number | string) => `/student/classrooms/${id}`,
    lesson: (id: number | string) => `/student/lessons/${id}`,
    homework: (id: number | string) => `/student/homeworks/${id}`,
    stats: "/student/stats",
  },
} as const;


