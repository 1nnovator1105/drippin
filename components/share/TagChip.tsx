import { cn } from "@/utils/cn";

interface TagChipProps {
  label: string;
  className?: string;
}

export default function TagChip({ label, className }: TagChipProps) {
  return (
    <div className={cn("p-1 rounded-sm text-black bg-[#CCC]", className)}>
      {label}
    </div>
  );
}
