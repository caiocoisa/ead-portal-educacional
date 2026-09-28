import { Label, Radio, RadioGroup } from "@heroui/react";

interface OptionsRadioGroupProps {
  options: string[];
  value: number | null;
  onChange: (index: number) => void;
  ariaLabel: string;
  /** Quando informado, a resposta foi confirmada: trava a escolha e destaca certa/errada. */
  correctIndex?: number;
}

export function OptionsRadioGroup({
  options,
  value,
  onChange,
  ariaLabel,
  correctIndex,
}: OptionsRadioGroupProps) {
  const isRevealed = correctIndex !== undefined;

  function stateClass(index: number) {
    if (!isRevealed) return "border-(--border)";
    if (index === correctIndex) return "border-(--success) bg-(--success)/10";
    if (index === value) return "border-(--danger) bg-(--danger)/10";
    return "border-(--border) opacity-70";
  }

  return (
    <RadioGroup
      aria-label={ariaLabel}
      value={value === null ? null : String(value)}
      onChange={(next) => onChange(Number(next))}
      isReadOnly={isRevealed}
      className="flex flex-col gap-2"
    >
      {options.map((option, index) => (
        <Radio
          key={index}
          value={String(index)}
          className={`rounded-lg border p-3 ${stateClass(index)}`}
        >
          <Radio.Content className="flex items-center gap-2">
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            <Label>{option}</Label>
            {isRevealed && index === correctIndex ? (
              <span className="ml-auto text-sm font-medium text-(--success)">
                ✓ Correta
              </span>
            ) : null}
            {isRevealed && index === value && index !== correctIndex ? (
              <span className="ml-auto text-sm font-medium text-(--danger)">
                ✗ Sua resposta
              </span>
            ) : null}
          </Radio.Content>
        </Radio>
      ))}
    </RadioGroup>
  );
}
