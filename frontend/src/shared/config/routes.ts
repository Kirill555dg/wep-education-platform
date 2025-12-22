export const routes = {
  login: "/login",
  register: "/register",
  app: "/",
  chat: "/chat",

  teacher: {
    home: "/teacher",
    classroom: (id: number | string) => `/teacher/classrooms/${id}`,
    lesson: (id: number | string) => `/teacher/lessons/${id}`,
    problems: "/teacher/problems",
    problemNew: "/teacher/problems/new",
    problem: (id: number | string) => `/teacher/problems/${id}`,
    stats: "/teacher/stats",
  },

  student: {
    home: "/student",
    classroom: (id: number | string) => `/student/classrooms/${id}`,
    lesson: (id: number | string) => `/student/lessons/${id}`,
    homework: (id: number | string) => `/student/homeworks/${id}`,
    stats: "/student/stats",
  },
} as const;


