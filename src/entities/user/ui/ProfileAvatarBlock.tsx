import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Camera } from "lucide-react";

interface Props {
  fullName: string;
  avatarUrl: string;
  school: string;
  grade: string;
  isEditing: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  activeRole: "teacher" | "student";
  onSwitchRole: (role: "teacher" | "student") => void;
}

export function ProfileAvatarBlock({
  fullName,
  avatarUrl,
  school,
  grade,
  isEditing,
  isTeacher,
  isStudent,
  activeRole,
  onSwitchRole,
}: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-32 w-32 sm:h-48 sm:w-48">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={fullName} />
          <AvatarFallback className="text-2xl">
            {fullName
              .split(" ")
              .map((p) => p[0])
              .join("")
              .substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <Button
            size="icon"
            className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-blue-600 hover:bg-blue-700"
          >
            <Camera className="h-5 w-5" />
          </Button>
        )}
      </div>

      <h2 className="text-xl font-bold mt-4">{fullName}</h2>
      <p className="text-gray-500 text-sm">
        {grade}, {school}
      </p>

      {isTeacher && isStudent && (
        <div className="mt-6 flex gap-2 w-full">
          <Button
            variant={activeRole === "student" ? "default" : "outline"}
            className="flex-1"
            onClick={() => onSwitchRole("student")}
          >
            Ученик
          </Button>
          <Button
            variant={activeRole === "teacher" ? "default" : "outline"}
            className="flex-1"
            onClick={() => onSwitchRole("teacher")}
          >
            Преподаватель
          </Button>
        </div>
      )}
    </div>
  );
}
