import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { filterOptions, TabType } from "../model/types";

interface Props {
  value: TabType;
  onChange: (val: TabType) => void;
}

export function NotificationsFilterTabs({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as TabType)} className="w-full">
      <TabsList className="grid grid-cols-6">
        {filterOptions.map((opt) => (
          <TabsTrigger key={opt.value} value={opt.value}>
            {opt.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
