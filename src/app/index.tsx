import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import RoleProtectedRoute from "@/shared/lib/router/RoleProtectedRoute";
import ProfilePage from "@/pages/profile/ProfilePage";
import StudentPage from "@/pages/student/StudentPage";
import TeacherPage from "@/pages/teacher/TeacherPage";
import { AuthBootstrapper } from "./providers/AuthBootstrapper";
import { Toaster } from "@/shared/ui/toaster";

function App() {
  return (
    <>
      <Toaster />
      <AuthBootstrapper />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route element={<RoleProtectedRoute requiredRole="student" />}>
          <Route path="/student" element={<StudentPage />} />
        </Route>

        <Route element={<RoleProtectedRoute requiredRole="teacher" />}>
          <Route path="/teacher" element={<TeacherPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </>
  );
}

export default App;
