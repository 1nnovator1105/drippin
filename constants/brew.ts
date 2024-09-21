import { BrewOption } from "@/types/brew";

export const brewOptions: BrewOption[] = [
  { value: "swirling", label: "스월링(흔들기)" },
  { value: "stirring", label: "스터링(저어주기)" },
  { value: "circle", label: "원을 그리며 붓기" },
  { value: "center", label: "중앙에 집중해 붓기" },
  { value: "fast", label: "빠르게 붓기" },
  { value: "slow", label: "천천히 붓기" },
];
