import { MainLayout } from "@/widgets/layout/MainLayout";
import { StudentClassesSection } from "@/widgets/student-dashboard/ui/StudentClassesSection";

export default function StudentPage() {
  return (
    <MainLayout title="Мои классы" footer="full">
      <StudentClassesSection />
    </MainLayout>
  );
}
