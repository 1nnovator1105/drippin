export interface SelectorOption {
  readonly label: string;
  readonly value: string;
}

export const createOption = (label: string) => ({
  label,
  value: label,
});
