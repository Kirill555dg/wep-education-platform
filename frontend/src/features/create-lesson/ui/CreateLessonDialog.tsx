/**
 * Dialog for creating a new lesson in a classroom
 */
import { useState } from "react";
import { useCreateLesson } from "../model/useCreateLesson";
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

interface CreateLessonDialogProps {
  classroomId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (lessonId: number) => void;
}

export function CreateLessonDialog({ 
  classroomId, 
  open, 
  onOpenChange, 
  onSuccess 
}: CreateLessonDialogProps) {
  const { createLesson, loading } = useCreateLesson();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const lesson = await createLesson({
        classroom_id: classroomId,
        title: formData.title,
        description: formData.description,
      });
      
      toast({
        title: "✅ Урок создан!",
        description: `Теперь вы можете добавить к нему домашние задания`,
      });

      setFormData({ title: "", description: "" });
      onOpenChange(false);
      onSuccess?.(lesson.id);
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось создать урок",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новый урок</DialogTitle>
          <DialogDescription>
            Создайте урок, к которому затем сможете добавить домашние задания
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название урока *</Label>
              <Input
                id="title"
                placeholder="Например: Квадратные уравнения"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Краткое описание темы урока..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
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
              {loading ? "Создание..." : "Создать урок"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

