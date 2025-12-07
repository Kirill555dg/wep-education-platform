import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/auth/login/LoginPage";
import RegisterPage from "@/pages/auth/register/RegisterPage";
import ResetPasswordPage from "@/pages/auth/reset-password/ResetPasswordPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import StudentPage from "@/pages/student/StudentPage";
import TeacherPage from "@/pages/teacher/TeacherPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import TeacherManagePage from "@/pages/teacher/manage/TeacherManagePage";
import TeacherClassroomPage from "@/pages/teacher/classroom/TeacherClassroomPage";
import TeacherLessonPage from "@/pages/teacher/lesson/TeacherLessonPage";
import TeacherHomeworkPage from "@/pages/teacher/homework/TeacherHomeworkPage";
import StudentClassroomPage from "@/pages/student/classroom/StudentClassroomPage";
import StudentLessonPage from "@/pages/student/lesson/StudentLessonPage";
import StudentHomeworkPage from "@/pages/student/homework/StudentHomeworkPage";
import { Toaster } from "@/shared/ui/toaster";
import AuthBootstrapper from "./providers/AuthBootstrapper";
import RoleProtectedRoute from "./router/RoleProtectedRoute";
import AuthProtectedRoute from "./router/AuthProtectedRoute ";
import { MainRedirect } from "./router/MainRedirect";
import { ClassBootstrapper } from "./providers/ClassBootstrapper";

function App() {
  return (
    <>
      <Toaster />
      <AuthBootstrapper />
      <ClassBootstrapper />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<AuthProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route element={<RoleProtectedRoute requiredRole="student" />}>
            <Route path="/student" element={<StudentPage />} />
            <Route path="/student/classroom/:classroomId" element={<StudentClassroomPage />} />
            <Route path="/student/lesson/:lessonId" element={<StudentLessonPage />} />
            <Route path="/student/homework/:homeworkId" element={<StudentHomeworkPage />} />
          </Route>

          <Route element={<RoleProtectedRoute requiredRole="teacher" />}>
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/teacher/classroom/:classroomId" element={<TeacherClassroomPage />} />
            <Route path="/teacher/lesson/:lessonId" element={<TeacherLessonPage />} />
            <Route path="/teacher/homework/:homeworkId" element={<TeacherHomeworkPage />} />
            <Route path="/teacher/manage" element={<TeacherManagePage />} />
          </Route>

          <Route path="/" element={<MainRedirect />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
