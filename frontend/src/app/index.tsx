import { Route, Routes } from "react-router-dom";

import { RequireAuth, RequireRole } from "@/app/router/guards";
import { AppLayout } from "@/widgets/layout/AppLayout";
import { HomeRedirect } from "@/pages/common/HomeRedirect";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ChatPage } from "@/pages/chat/ChatPage";
import { TeacherClassroomPage } from "@/pages/teacher/TeacherClassroomPage";
import { TeacherClassroomSettingsPage } from "@/pages/teacher/TeacherClassroomSettingsPage";
import { TeacherHomePage } from "@/pages/teacher/TeacherHomePage";
import { TeacherLessonPage } from "@/pages/teacher/TeacherLessonPage";
import { TeacherHomeworkPage } from "@/pages/teacher/TeacherHomeworkPage";
import { TeacherHomeworkCreatePage } from "@/pages/teacher/TeacherHomeworkCreatePage";
import { TeacherProblemsPage } from "@/pages/teacher/TeacherProblemsPage";
import { TeacherProblemEditorPage } from "@/pages/teacher/TeacherProblemEditorPage";
import { TeacherStatsPage } from "@/pages/teacher/TeacherStatsPage";
import { TeacherClassroomStatsPage } from "@/pages/teacher/TeacherClassroomStatsPage";
import { StudentClassroomPage } from "@/pages/student/StudentClassroomPage";
import { StudentHomePage } from "@/pages/student/StudentHomePage";
import { StudentLessonPage } from "@/pages/student/StudentLessonPage";
import { StudentHomeworkPage } from "@/pages/student/StudentHomeworkPage";
import { StudentStatsPage } from "@/pages/student/StudentStatsPage";

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
            <Route path="/teacher/classrooms/:classroomId/settings" element={<TeacherClassroomSettingsPage />} />
            <Route path="/teacher/lessons/:lessonId" element={<TeacherLessonPage />} />
            <Route path="/teacher/lessons/:lessonId/homeworks/new" element={<TeacherHomeworkCreatePage />} />
            <Route path="/teacher/homeworks/:homeworkId" element={<TeacherHomeworkPage />} />
            <Route path="/teacher/problems" element={<TeacherProblemsPage />} />
            <Route path="/teacher/problems/:problemId" element={<TeacherProblemEditorPage />} />
            <Route path="/teacher/stats" element={<TeacherStatsPage />} />
            <Route path="/teacher/stats/classrooms/:classroomId" element={<TeacherClassroomStatsPage />} />
          </Route>

          <Route element={<RequireRole role="student" />}>
            <Route path="/student" element={<StudentHomePage />} />
            <Route path="/student/classrooms/:classroomId" element={<StudentClassroomPage />} />
            <Route path="/student/lessons/:lessonId" element={<StudentLessonPage />} />
            <Route path="/student/homeworks/:homeworkId" element={<StudentHomeworkPage />} />
            <Route path="/student/stats" element={<StudentStatsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
