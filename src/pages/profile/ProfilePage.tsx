import { useUserStore } from "@/entities/user/model/store";
import { useState } from "react";
import { profileApi } from "@/features/profile/api/profile-api";
import type { User, UserRole } from "@/entities/user/model/types";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/widgets/layout/MainLayout";
import { ProfileViewer } from "./ui/ProfileViewer";
import { ProfileEditor } from "./ui/ProfileEditor";

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleSave = async (updated: Partial<User>) => {
    const result = await profileApi.updateProfile(updated);
    setUser(result);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleRoleSwitch = async (role: UserRole) => {
    const result = await profileApi.updateProfile({ ...user, role });
    setUser(result);
    navigate(`/${role}`);
  };

  return (
    <MainLayout title="Профиль">
      <div className="w-full sm:max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-8">
        {isEditing ? (
          <ProfileEditor user={user} onSave={handleSave} onCancel={handleCancel} />
        ) : (
          <ProfileViewer user={user} onEditClick={() => setIsEditing(true)} onSwitchRole={handleRoleSwitch} />
        )}
      </div>
    </MainLayout>
  );
}
