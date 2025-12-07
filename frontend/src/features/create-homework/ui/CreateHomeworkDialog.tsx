/**
 * Dialog for creating homework in a lesson
 */
import { useState } from "react";
import { useCreateHomework } from "../model/useCreateHomework";
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

interface CreateHomeworkDialogProps {
  lessonId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (homeworkId: number) => void;
}

export function CreateHomeworkDialog({ 
  lessonId, 
  open, 
  onOpenChange, 
  onSuccess 
}: CreateHomeworkDialogProps) {
  const { createHomework, loading } = useCreateHomework();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    max_score: "100",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const homework = await createHomework({
        lesson_id: lessonId,
        title: formData.title,
        description: formData.description,
        max_score: parseInt(formData.max_score),
      });
      
      toast({
        title: "✅ Домашнее задание создано!",
        description: `Теперь добавьте к нему задачи`,
      });

      setFormData({ title: "", description: "", max_score: "100" });
      onOpenChange(false);
      onSuccess?.(homework.id);
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось создать домашнее задание",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать домашнее задание</DialogTitle>
          <DialogDescription>
            Создайте ДЗ, к которому затем добавите задачи
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название ДЗ *</Label>
              <Input
                id="title"
                placeholder="Например: Решение квадратных уравнений"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Инструкции для учеников..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
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
              {loading ? "Создание..." : "Создать ДЗ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

