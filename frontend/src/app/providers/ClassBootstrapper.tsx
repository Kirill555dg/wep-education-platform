import { useEffect } from "react";
import { useUserStore } from "@/entities/user/model/store";
import { useClassStore } from "@/entities/class/model/store";
import { classroomsApi } from "@/shared/api";
import { API_CONFIG } from "@/shared/config/api.config";
import { getClassesForStudent } from "@/entities/student/lib/getClassesForStudent";

/**
 * Bootstrapper for loading user's classrooms
 * Uses real API when enabled, falls back to mock data otherwise
 */
export const ClassBootstrapper = () => {
  const user = useUserStore((s) => s.user);
  const resetClasses = useClassStore((s) => s.resetClasses);

  useEffect(() => {
    if (!user) return;

    const loadClasses = async () => {
      try {
        if (API_CONFIG.USE_REAL_API && user.role === "student") {
          // Load classes from real API
          const classrooms = await classroomsApi.getAll();
          
          // Map backend Classroom to frontend ClassItem
          const classItems = classrooms.map((classroom) => ({
            id: classroom.id,
            name: classroom.name,
            subject: classroom.subject,
            description: classroom.description ?? "",
            schedule: "",
            classroom: classroom.name,
            entryCode: classroom.invite_code || "",
            teacherId: classroom.teacher_id,
            activeAssignments: 0,
            image: `/class/${classroom.subject.toLowerCase()}.jpg`,
          }));
          
          resetClasses(classItems);
        } else if (user.role === "student") {
          // Fallback to mock data
          const classes = getClassesForStudent(user.id);
          resetClasses(classes);
        }
      } catch (error) {
        console.error("Failed to load classrooms:", error);
        // Fallback to mock on error
        if (user.role === "student") {
          const classes = getClassesForStudent(user.id);
          resetClasses(classes);
        }
      }
    };

    loadClasses();
  }, [user, resetClasses]);

  return null;
};
