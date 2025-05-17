import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Calendar, Mail, MapPin, Phone, Link as LinkIcon, User as UserIcon } from "lucide-react";
import { ProfileEditableField } from "./ProfileEditableField";
import { ProfileAvatarBlock } from "./ProfileAvatarBlock";
import { getFullNameAdaptive } from "@/entities/user/lib/format";
import type { User, UserRole } from "@/entities/user/model/types";

interface ProfileEditorProps {
  user: User;
  onSave: (updated: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

export function ProfileEditor({ user, onSave, onCancel }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    ...user,
    phone: user.phone || "",
    address: user.address || "",
    about: user.about || "",
    birthDate: user.birthDate || "",
    telegram: user.contacts?.telegram || "",
    vk: user.contacts?.vk || "",
  });

  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatar: url }));
  };

  const handleRoleSwitch = (role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSaveClick = async () => {
    setSaving(true);
    try {
      await onSave({
        ...formData,
        contacts: {
          telegram: formData.telegram,
          vk: formData.vk,
        },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileAvatarBlock
          fullName={getFullNameAdaptive(formData, true)}
          avatarUrl={formData.avatar}
          isEditing
          activeRole={formData.role}
          onSwitchRole={handleRoleSwitch}
          onAvatarChange={handleAvatarChange}
        />

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
              Редактирование профиля
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Отмена
              </Button>
              <Button onClick={handleSaveClick} disabled={saving}>
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <ProfileEditableField
              id="lastName"
              label="Фамилия"
              value={formData.lastName}
              onChange={handleChange}
              isEditing
            />
            <ProfileEditableField
              id="firstName"
              label="Имя"
              value={formData.firstName}
              onChange={handleChange}
              isEditing
            />
            <ProfileEditableField
              id="middleName"
              label="Отчество"
              value={formData.middleName || ""}
              onChange={handleChange}
              isEditing
            />
            <ProfileEditableField
              id="birthDate"
              label="Дата рождения"
              icon={<Calendar className="h-4 w-4" />}
              value={formData.birthDate}
              onChange={handleChange}
              isEditing
            />
            <ProfileEditableField
              id="about"
              label="О себе"
              value={formData.about}
              onChange={handleChange}
              isEditing
              multiline
            />
          </div>

          <div className="mt-10 mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              Контакты
            </h3>

            <div className="space-y-6 mt-4">
              <ProfileEditableField
                id="email"
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                value={formData.email}
                onChange={handleChange}
                isEditing
              />
              <ProfileEditableField
                id="phone"
                label="Телефон"
                icon={<Phone className="h-4 w-4" />}
                value={formData.phone}
                onChange={handleChange}
                isEditing
              />
              <ProfileEditableField
                id="address"
                label="Адрес"
                icon={<MapPin className="h-4 w-4" />}
                value={formData.address}
                onChange={handleChange}
                isEditing
              />
              <ProfileEditableField
                id="telegram"
                label="Telegram"
                icon={<LinkIcon className="h-4 w-4" />}
                value={formData.telegram}
                onChange={handleChange}
                isEditing
              />
              <ProfileEditableField
                id="vk"
                label="VK"
                icon={<LinkIcon className="h-4 w-4" />}
                value={formData.vk}
                onChange={handleChange}
                isEditing
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
