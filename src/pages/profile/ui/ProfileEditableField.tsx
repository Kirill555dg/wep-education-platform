import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

interface Props {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
}

export function ProfileEditableField({ id, label, icon, value, isEditing, onChange, multiline = false }: Props) {
  return (
    <div>
      <Label htmlFor={id} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      {isEditing ? (
        multiline ? (
          <Textarea id={id} name={id} value={value} onChange={onChange} className="mt-1 min-h-[100px]" />
        ) : (
          <Input id={id} name={id} value={value} onChange={onChange} className="mt-1" />
        )
      ) : (
        <p className="mt-1 text-gray-900">{value}</p>
      )}
    </div>
  );
}
