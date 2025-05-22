import { useClassStore } from "@/entities/class/model/store";
import { ClassCard } from "@/entities/class/ui/ClassCard";
import { JoinClassDialog } from "@/features/join-class/ui/JoinClassDialog";

export const StudentClassesSection = () => {
  const classes = useClassStore((s) => s.joinedClasses);

  return (
    <section className="w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <header className="flex flex-col-reverse sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Текущие классы</h2>
        <JoinClassDialog />
      </header>

      {classes.length === 0 ? (
        <p className="text-gray-600 text-sm">Вы ещё не присоединились ни к одному классу.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls.id} {...cls} />
          ))}
        </div>
      )}
    </section>
  );
};
