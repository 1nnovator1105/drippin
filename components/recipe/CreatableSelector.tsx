import { SelectorOption, createOption } from "@/utils/selector";
import React, { useState } from "react";

import CreatableSelect from "react-select/creatable";

interface CreatableSelectorProps {
  value: SelectorOption | null;
  setValue: (value: SelectorOption | null) => void;
  defaultOptions?: SelectorOption[];
  placeholder?: string;
}

export default function CreatableSelector({
  value,
  setValue,
  defaultOptions = [],
  placeholder = "선택해주세요",
}: CreatableSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...(prev || []), newOption]);
      setValue(newOption);
    }, 1000);
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      placeholder={placeholder}
      onChange={(newValue) => setValue(newValue)}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
}
