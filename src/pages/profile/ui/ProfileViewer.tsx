import { Card } from "@/shared/ui/card";
import { Mail, MapPin, Phone, User as UserIcon, Link as LinkIcon, Calendar } from "lucide-react";
import { ProfileAvatarBlock } from "./ProfileAvatarBlock";
import { getFullName } from "@/entities/user/lib/format";
import type { User } from "@/entities/user/model/types";

interface ProfileViewerProps {
  user: User;
  onEditClick: () => void;
  onSwitchRole: (role: "student" | "teacher") => void;
}

export function ProfileViewer({ user, onEditClick, onSwitchRole }: ProfileViewerProps) {
  return (
    <Card className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileAvatarBlock
          fullName={getFullName(user)}
          avatarUrl={user.avatar}
          isEditing={false}
          activeRole={user.role}
          onSwitchRole={onSwitchRole}
        />

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
              Личная информация
            </h3>
            <button onClick={onEditClick} className="text-sm text-blue-600 hover:underline font-medium">
              Редактировать
            </button>
          </div>

          <div className="space-y-4">
            <Field label="Фамилия" value={user.lastName} />
            <Field label="Имя" value={user.firstName} />
            {user.middleName && <Field label="Отчество" value={user.middleName} />}
            {user.birthDate && (
              <Field label="Дата рождения" value={user.birthDate} icon={<Calendar className="h-4 w-4" />} />
            )}
            {user.about && <Field label="О себе" value={user.about} multiline />}
          </div>

          <div className="mt-10 mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              Контакты
            </h3>

            <div className="space-y-4 mt-4">
              <Field label="Email" value={user.email} icon={<Mail className="h-4 w-4" />} />
              {user.phone && <Field label="Телефон" value={user.phone} icon={<Phone className="h-4 w-4" />} />}
              {user.address && <Field label="Адрес" value={user.address} icon={<MapPin className="h-4 w-4" />} />}
              {user.contacts?.telegram && (
                <Field label="Telegram" value={user.contacts.telegram} icon={<LinkIcon className="h-4 w-4" />} />
              )}
              {user.contacts?.vk && (
                <Field label="VK" value={user.contacts.vk} icon={<LinkIcon className="h-4 w-4" />} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Field({
  label,
  value,
  icon,
  multiline = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  multiline?: boolean;
}) {
  return (
    <div>
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-base text-gray-900 whitespace-pre-line">{value}</p>
    </div>
  );
}
