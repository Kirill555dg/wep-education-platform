import { useAuthStore } from "@/features/auth/model/store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { BookOpen, Calendar, Mail, MapPin, Phone, School } from "lucide-react";
import { ResponsiveHeader } from "@/widgets/layout/ResponsiveHeader";
import { Footer } from "@/widgets/layout/Footer";
import { ProfileEditableField } from "@/entities/user/ui/ProfileEditableField";
import { ProfileAvatarBlock } from "@/entities/user/ui/ProfileAvatarBlock";
import { getFullName } from "@/entities/user/lib/format";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  if (!user) return null;

  const [formData, setFormData] = useState({
    ...user,
    phone: "+7 (999) 123-45-67",
    address: "г. Москва, ул. Примерная, д. 42, кв. 101",
    school: "Школа №123",
    grade: "10А",
    about: "Интересуюсь математикой, физикой и веб-разработкой.",
    birthDate: "2009-05-15",
    age: 16,
    isTeacher: user.role === "teacher",
    isStudent: user.role === "student",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeRole, setActiveRole] = useState<"teacher" | "student">(user.role);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Сохраняем:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      ...user,
      phone: "+7 (999) 123-45-67",
      address: "г. Москва, ул. Примерная, д. 42, кв. 101",
      school: "Школа №123",
      grade: "10А",
      about: "Интересуюсь математикой, физикой и веб-разработкой.",
      birthDate: "2009-05-15",
      age: 16,
      isTeacher: user.role === "teacher",
      isStudent: user.role === "student",
    });
    setIsEditing(false);
  };

  const switchRole = (role: "teacher" | "student") => {
    setActiveRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-white sm:bg-gray-100 flex flex-col">
      <ResponsiveHeader title="Профиль" />

      <main className="flex-1">
        <div className="w-full sm:max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Card className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <ProfileAvatarBlock
                fullName={getFullName(formData)}
                avatarUrl={user.avatar || "/placeholder.svg"}
                school={formData.school}
                grade={formData.grade}
                isEditing={isEditing}
                isTeacher={formData.isTeacher}
                isStudent={formData.isStudent}
                activeRole={activeRole}
                onSwitchRole={switchRole}
              />

              {/* Информация */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Личная информация</h3>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Отмена
                      </Button>
                      <Button onClick={handleSave}>Сохранить</Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <ProfileEditableField
                    id="firstName"
                    name="firstName"
                    label="Имя"
                    value={formData.firstName}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <ProfileEditableField
                    id="lastName"
                    name="lastName"
                    label="Фамилия"
                    value={formData.lastName}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <ProfileEditableField
                    id="middleName"
                    name="middleName"
                    label="Отчество"
                    value={formData.middleName || ""}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <ProfileEditableField
                    id="birthDate"
                    name="birthDate"
                    label="Дата рождения"
                    icon={<Calendar className="h-4 w-4" />}
                    value={formData.birthDate}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <ProfileEditableField
                    id="email"
                    name="email"
                    label="Email"
                    icon={<Mail className="h-4 w-4" />}
                    value={formData.email}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <ProfileEditableField
                    id="phone"
                    name="phone"
                    label="Телефон"
                    icon={<Phone className="h-4 w-4" />}
                    value={formData.phone}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <ProfileEditableField
                    id="address"
                    name="address"
                    label="Адрес"
                    icon={<MapPin className="h-4 w-4" />}
                    value={formData.address}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <ProfileEditableField
                    id="school"
                    name="school"
                    label="Школа"
                    icon={<School className="h-4 w-4" />}
                    value={formData.school}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <ProfileEditableField
                    id="grade"
                    name="grade"
                    label="Класс"
                    icon={<BookOpen className="h-4 w-4" />}
                    value={formData.grade}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <ProfileEditableField
                    id="about"
                    name="about"
                    label="О себе"
                    value={formData.about}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    multiline
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
