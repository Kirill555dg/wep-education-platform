/**
 * Dialog for adding a problem to homework
 */
import { useState } from "react";
import { useManageProblems } from "../model/useManageProblems";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/hooks/use-toast";

interface CreateProblemDialogProps {
  onProblemCreated: (problemId: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProblemDialog({ 
  onProblemCreated,
  open, 
  onOpenChange,
}: CreateProblemDialogProps) {
  const { createProblem, loading } = useManageProblems();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem_type: "short_answer" as const,
    difficulty: "medium" as const,
    correct_answer: "",
    explanation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const problem = await createProblem({
        title: formData.title,
        description: formData.description,
        problem_type: formData.problem_type,
        difficulty: formData.difficulty,
        correct_answer: formData.correct_answer || null,
        explanation: formData.explanation || null,
      });
      
      toast({
        title: "✅ Задача создана!",
        description: "Теперь добавьте её к домашнему заданию",
      });

      setFormData({ 
        title: "", 
        description: "", 
        problem_type: "short_answer",
        difficulty: "medium",
        correct_answer: "", 
        explanation: "" 
      });
      onOpenChange(false);
      onProblemCreated(problem.id);
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось создать задачу",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добавить задачу</DialogTitle>
          <DialogDescription>
            Создайте новую задачу для домашнего задания
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название задачи *</Label>
              <Input
                id="title"
                placeholder="Например: Задача №1"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Условие задачи *</Label>
              <Textarea
                id="description"
                placeholder="Опишите условие задачи..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="problem_type">Тип задачи</Label>
                <select
                  id="problem_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.problem_type}
                  onChange={(e) => setFormData({ ...formData, problem_type: e.target.value as any })}
                >
                  <option value="short_answer">Короткий ответ</option>
                  <option value="essay">Развёрнутый ответ</option>
                  <option value="multiple_choice">Выбор варианта</option>
                  <option value="true_false">Верно/Неверно</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="difficulty">Сложность</Label>
                <select
                  id="difficulty"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                >
                  <option value="easy">Лёгкая</option>
                  <option value="medium">Средняя</option>
                  <option value="hard">Сложная</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="correct_answer">Правильный ответ</Label>
              <Input
                id="correct_answer"
                placeholder="Ответ для автоматической проверки"
                value={formData.correct_answer}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Оставьте пустым, если проверка будет вручную
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="explanation">Объяснение решения</Label>
              <Textarea
                id="explanation"
                placeholder="Как решать эту задачу..."
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Создание..." : "Добавить задачу"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

