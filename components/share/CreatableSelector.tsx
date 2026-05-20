import { SelectorOption, createOption } from "@/utils/selector";
import React, { useEffect, useId, useState } from "react";

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
  // SSR/CSR 간 일관된 id를 부여해 react-select 하이드레이션 mismatch를 방지한다.
  const instanceId = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);

  // react-select는 SSR 시 aria-activedescendant 등의 속성으로 하이드레이션 경고를
  // 발생시킨다. 로그인 뒤 폼 입력이라 SEO와 무관하므로 마운트 후에만 렌더한다.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...(prev || []), newOption]);
      setValue(newOption);
    }, 1000);
  };

  // 마운트 전에는 동일한 높이의 비활성 플레이스홀더로 레이아웃 시프트를 방지한다.
  if (!isMounted) {
    return (
      <div className="flex min-h-[38px] items-center rounded border border-[hsl(0,0%,80%)] bg-white px-3 text-sm text-gray-400">
        {value?.label ?? placeholder}
      </div>
    );
  }

  return (
    <CreatableSelect
      instanceId={instanceId}
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
