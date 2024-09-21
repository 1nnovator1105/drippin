export interface BrewingInfo {
  label: string;
  order: number;
  water: number | null;
  time: number | null;
  brewOption: BrewOption[] | null;
  memo: string | null;
  isConfirm: boolean;
}

export interface BrewOption {
  value: string;
  label: string;
}
