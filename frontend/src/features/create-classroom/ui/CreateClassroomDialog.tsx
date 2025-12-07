/**
 * Dialog for creating a new classroom
 */
import { useState } from "react";
import { useCreateClassroom } from "../model/useCreateClassroom";
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
import { useToast } from "@/shared/ui/use-toast";

interface CreateClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateClassroomDialog({ open, onOpenChange, onSuccess }: CreateClassroomDialogProps) {
  const { createClassroom, loading } = useCreateClassroom();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const classroom = await createClassroom(formData);
      
      toast({
        title: "✅ Класс создан!",
        description: `Код для присоединения: ${classroom.invite_code}`,
      });

      // Reset form
      setFormData({ name: "", subject: "", description: "" });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось создать класс",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новый класс</DialogTitle>
          <DialogDescription>
            Заполните информацию о классе. Ученики смогут присоединиться по коду.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название класса *</Label>
              <Input
                id="name"
                placeholder="Например: 10А Физика"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Предмет *</Label>
              <Input
                id="subject"
                placeholder="Например: Физика"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Краткое описание класса..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              {loading ? "Создание..." : "Создать класс"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

