/**
 * Teacher Management Page
 * Allows teachers to create classrooms, lessons, and homework
 */
import { useState } from "react";
import { useCreateClassroom } from "@/features/create-classroom/model/useCreateClassroom";
import { useCreateLesson } from "@/features/create-lesson/model/useCreateLesson";
import { useCreateHomework } from "@/features/create-homework/model/useCreateHomework";
import { useManageProblems } from "@/features/manage-problems/model/useManageProblems";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Card } from "@/shared/ui/card";

export default function TeacherManagePage() {
  const { createClassroom, loading: classroomLoading } = useCreateClassroom();
  const { createLesson, loading: lessonLoading } = useCreateLesson();
  const { createHomework, createProblem: createHomeworkProblem, loading: homeworkLoading } = useCreateHomework();
  const { createProblem, loading: problemLoading } = useManageProblems();

  const [classroomId, setClassroomId] = useState<number | null>(null);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [problemIds, setProblemIds] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleCreateClassroom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const classroom = await createClassroom({
        name: formData.get("className") as string,
        subject: formData.get("subject") as string,
        description: formData.get("description") as string,
      });
      
      setClassroomId(classroom.id);
      setMessage(`✅ Класс создан! ID: ${classroom.id}, Код: ${classroom.invite_code}`);
      e.currentTarget.reset();
    } catch (error) {
      setMessage(`❌ Ошибка при создании класса`);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!classroomId) {
      setMessage("❌ Сначала создайте класс");
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    try {
      const lesson = await createLesson({
        classroom_id: classroomId,
        title: formData.get("lessonTitle") as string,
        description: formData.get("lessonDescription") as string,
      });
      
      setLessonId(lesson.id);
      setMessage(`✅ Урок создан! ID: ${lesson.id}`);
      e.currentTarget.reset();
    } catch (error) {
      setMessage(`❌ Ошибка при создании урока`);
    }
  };

  const handleCreateProblem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const problem = await createProblem({
        title: formData.get("problemTitle") as string,
        description: formData.get("problemDescription") as string,
        problem_type: "short_answer",
        difficulty: "medium",
        correct_answer: formData.get("correctAnswer") as string,
      });
      
      setProblemIds([...problemIds, problem.id]);
      setMessage(`✅ Задача создана! ID: ${problem.id}`);
      e.currentTarget.reset();
    } catch (error) {
      setMessage(`❌ Ошибка при создании задачи`);
    }
  };

  const handleCreateHomework = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lessonId) {
      setMessage("❌ Сначала создайте урок");
      return;
    }
    if (problemIds.length === 0) {
      setMessage("❌ Сначала создайте хотя бы одну задачу");
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    try {
      const homework = await createHomework({
        lesson_id: lessonId,
        title: formData.get("homeworkTitle") as string,
        description: formData.get("homeworkDescription") as string,
        problem_ids: problemIds,
        max_score: 100,
      });
      
      setMessage(`✅ Домашнее задание создано! ID: ${homework.id}`);
      e.currentTarget.reset();
    } catch (error) {
      setMessage(`❌ Ошибка при создании ДЗ`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Управление курсом (Преподаватель)</h1>
      
      {message && (
        <div className="p-4 rounded bg-gray-100 border">
          {message}
        </div>
      )}

      {/* Step 1: Create Classroom */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">1. Создать класс</h2>
        <form onSubmit={handleCreateClassroom} className="space-y-4">
          <Input name="className" placeholder="Название класса" required />
          <Input name="subject" placeholder="Предмет" required />
          <Textarea name="description" placeholder="Описание" />
          <Button type="submit" disabled={classroomLoading}>
            {classroomLoading ? "Создание..." : "Создать класс"}
          </Button>
        </form>
      </Card>

      {/* Step 2: Create Lesson */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">2. Создать урок</h2>
        <form onSubmit={handleCreateLesson} className="space-y-4">
          <Input name="lessonTitle" placeholder="Название урока" required />
          <Textarea name="lessonDescription" placeholder="Описание урока" />
          <Button type="submit" disabled={lessonLoading || !classroomId}>
            {lessonLoading ? "Создание..." : "Создать урок"}
          </Button>
        </form>
      </Card>

      {/* Step 3: Create Problems */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">3. Создать задачи</h2>
        <form onSubmit={handleCreateProblem} className="space-y-4">
          <Input name="problemTitle" placeholder="Название задачи" required />
          <Textarea name="problemDescription" placeholder="Текст задачи" required />
          <Input name="correctAnswer" placeholder="Правильный ответ" required />
          <Button type="submit">Добавить задачу</Button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Создано задач: {problemIds.length}
        </p>
      </Card>

      {/* Step 4: Create Homework */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">4. Создать домашнее задание</h2>
        <form onSubmit={handleCreateHomework} className="space-y-4">
          <Input name="homeworkTitle" placeholder="Название ДЗ" required />
          <Textarea name="homeworkDescription" placeholder="Описание ДЗ" />
          <Button type="submit" disabled={homeworkLoading || !lessonId || problemIds.length === 0}>
            {homeworkLoading ? "Создание..." : "Создать ДЗ"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

