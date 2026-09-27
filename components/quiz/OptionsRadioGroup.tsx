import { Label, Radio, RadioGroup } from "@heroui/react";

interface OptionsRadioGroupProps {
  options: string[];
  value: number | null;
  onChange: (index: number) => void;
  ariaLabel: string;
}

export function OptionsRadioGroup({
  options,
  value,
  onChange,
  ariaLabel,
}: OptionsRadioGroupProps) {
  return (
    <RadioGroup
      aria-label={ariaLabel}
      value={value === null ? null : String(value)}
      onChange={(next) => onChange(Number(next))}
      className="flex flex-col gap-2"
    >
      {options.map((option, index) => (
        <Radio key={index} value={String(index)}>
          <Radio.Content className="flex items-center gap-2">
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            <Label>{option}</Label>
          </Radio.Content>
        </Radio>
      ))}
    </RadioGroup>
  );
}
