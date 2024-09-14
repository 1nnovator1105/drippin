import { SelectorOption, createOption } from "@/utils/selector";
import React, { useState } from "react";

import CreatableSelect from "react-select/creatable";

interface CreatableSelectorProps {
  value: SelectorOption | null;
  setValue: (value: SelectorOption | null) => void;
  defaultOptions?: SelectorOption[];
}

export default function CreatableSelector({
  value,
  setValue,
  defaultOptions = [],
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
      onChange={(newValue) => setValue(newValue)}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
}
