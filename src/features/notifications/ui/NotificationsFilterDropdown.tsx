import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { ChevronDown } from "lucide-react";
import { filterOptions, TabType } from "../model/types";

interface Props {
  value: TabType;
  onChange: (val: TabType) => void;
}

export function NotificationsFilterDropdown({ value, onChange }: Props) {
  const current = filterOptions.find((opt) => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>{current?.label || "Фильтр"}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px]">
        {filterOptions.map((opt) => (
          <DropdownMenuItem key={opt.value} onClick={() => onChange(opt.value)}>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
