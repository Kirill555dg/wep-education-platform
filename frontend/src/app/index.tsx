import { Route, Routes } from "react-router-dom";

import { RequireAuth, RequireRole } from "@/app/router/guards";
import { AppLayout } from "@/widgets/layout/AppLayout";
import { HomeRedirect } from "@/pages/common/HomeRedirect";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ChatPage } from "@/pages/chat/ChatPage";
import { TeacherClassroomPage } from "@/pages/teacher/TeacherClassroomPage";
import { TeacherHomePage } from "@/pages/teacher/TeacherHomePage";
import { TeacherLessonPage } from "@/pages/teacher/TeacherLessonPage";
import { TeacherProblemsPage } from "@/pages/teacher/TeacherProblemsPage";
import { TeacherProblemEditorPage } from "@/pages/teacher/TeacherProblemEditorPage";
import { StudentClassroomPage } from "@/pages/student/StudentClassroomPage";
import { StudentHomePage } from "@/pages/student/StudentHomePage";
import { StudentLessonPage } from "@/pages/student/StudentLessonPage";
import { StudentHomeworkPage } from "@/pages/student/StudentHomeworkPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route element={<RequireRole role="teacher" />}>
            <Route path="/teacher" element={<TeacherHomePage />} />
            <Route path="/teacher/classrooms/:classroomId" element={<TeacherClassroomPage />} />
            <Route path="/teacher/lessons/:lessonId" element={<TeacherLessonPage />} />
            <Route path="/teacher/problems" element={<TeacherProblemsPage />} />
            <Route path="/teacher/problems/:problemId" element={<TeacherProblemEditorPage />} />
          </Route>

          <Route element={<RequireRole role="student" />}>
            <Route path="/student" element={<StudentHomePage />} />
            <Route path="/student/classrooms/:classroomId" element={<StudentClassroomPage />} />
            <Route path="/student/lessons/:lessonId" element={<StudentLessonPage />} />
            <Route path="/student/homeworks/:homeworkId" element={<StudentHomeworkPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
