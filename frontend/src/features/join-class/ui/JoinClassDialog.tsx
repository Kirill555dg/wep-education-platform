import { useState, useEffect } from "react";
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
import { useJoinClass } from "../model/useJoinClass";
import { useToast } from "@/shared/hooks/use-toast";

interface JoinClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const JoinClassDialog = ({ open, onOpenChange, onSuccess }: JoinClassDialogProps) => {
  const [code, setCode] = useState("");
  const { joinClass, loading, error, clearError } = useJoinClass();
  const { toast } = useToast();

  const handleJoin = async () => {
    const success = await joinClass(code);
    if (success) {
      toast({
        title: "✅ Вы присоединились к классу!",
        description: "Теперь вы можете просматривать уроки и выполнять задания",
      });
      setCode("");
      onOpenChange(false);
      onSuccess?.();
    }
  };

  // Сброс ошибки и поля при открытии/закрытии
  useEffect(() => {
    if (!open) {
      setCode("");
      clearError?.();
    }
  }, [open, clearError]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Присоединиться к классу</DialogTitle>
          <DialogDescription>
            Введите код приглашения, который предоставил вам преподаватель
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="class-code">Код класса *</Label>
          <Input
            id="class-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Например: ABC123"
            className="mt-2 font-mono"
            required
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
          <Button onClick={handleJoin} disabled={loading || !code.trim()}>
            {loading ? "Присоединение..." : "Присоединиться"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
