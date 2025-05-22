import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Plus } from "lucide-react";
import { useJoinClass } from "../model/useJoinClass";

export const JoinClassDialog = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const { joinClass, loading } = useJoinClass();

  const handleJoin = async () => {
    await joinClass(code);
    setCode("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Вступить в класс
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вступить в класс</DialogTitle>
          <DialogDescription>Введите код класса, который вам предоставил учитель.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="class-code">Код класса</Label>
          <Input
            id="class-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Например: XYZ123"
            className="mt-2"
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Отмена
          </Button>
          <Button onClick={handleJoin} className="w-full sm:w-auto" disabled={loading}>
            {loading ? "Присоединение..." : "Присоединиться"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
