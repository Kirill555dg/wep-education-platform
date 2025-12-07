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
  homeworkId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateProblemDialog({ 
  homeworkId, 
  open, 
  onOpenChange, 
  onSuccess 
}: CreateProblemDialogProps) {
  const { createProblem, loading } = useManageProblems();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    correct_answer: "",
    max_score: "10",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProblem({
        title: formData.title,
        description: formData.description,
        correct_answer: formData.correct_answer,
        max_score: parseInt(formData.max_score),
      });
      
      toast({
        title: "✅ Задача добавлена!",
      });

      setFormData({ title: "", description: "", correct_answer: "", max_score: "10" });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось добавить задачу",
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
              <Label htmlFor="max_score">Максимальный балл</Label>
              <Input
                id="max_score"
                type="number"
                min="1"
                value={formData.max_score}
                onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
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

