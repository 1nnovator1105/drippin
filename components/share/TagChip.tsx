import { cn } from "@/utils/cn";

interface TagChipProps {
  label: string;
  className?: string;
}

export default function TagChip({ label, className }: TagChipProps) {
  return (
    <div
      className={cn(
        "py-[2px] px-2 rounded-sm font-regular text-sm text-[#1E1E1E] bg-[#CCC]",
        className,
      )}
    >
      {label}
    </div>
  );
}
