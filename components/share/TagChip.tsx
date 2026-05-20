import { cn } from "@/utils/cn";

interface TagChipProps {
  label: string;
  className?: string;
}

export default function TagChip({ label, className }: TagChipProps) {
  return (
    <div
      className={cn(
        "py-[2px] px-2 rounded-md font-regular text-sm text-stone-600 bg-stone-100",
        className,
      )}
    >
      {label}
    </div>
  );
}
