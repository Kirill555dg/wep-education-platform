/**
 * Lesson entity types
 */

export interface Lesson {
  id: number;
  title: string;
  description: string | null;
  classroomId: number;
  orderNumber: number | null;
  scheduledAt: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LessonDetail extends Lesson {
  materialsCount: number;
  homeworksCount: number;
}

