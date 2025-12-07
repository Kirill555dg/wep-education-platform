import { useState } from "react";
import { classroomsApi } from "@/shared/api";
import { useClassStore } from "@/entities/class/model/store";
import type { Classroom } from "@/shared/api";

/**
 * Hook for joining a classroom using real API
 */
export function useJoinClass() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addClass = useClassStore((s) => s.addClass);
  const hasClass = useClassStore((s) => s.hasClass);

  const joinClass = async (code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Call real API to join classroom
      const classroom = await classroomsApi.join({ invite_code: code });

      // Check if already joined (this should be handled by backend)
      if (hasClass(classroom.invite_code || "")) {
        throw new Error("Вы уже присоединились к этому классу");
      }

      // Map backend Classroom to frontend ClassItem
      const classItem = {
        id: classroom.id,
        name: classroom.name,
        subject: classroom.subject,
        teacher: "Преподаватель", // Will be fetched separately if needed
        students: classroom.students_count,
        entryCode: classroom.invite_code || "",
        imageUrl: `/class/${classroom.subject.toLowerCase()}.jpg`, // Default image
      };

      addClass(classItem);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Не удалось присоединиться к классу";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { joinClass, loading, error, clearError };
}

