import { Label, Radio, RadioGroup } from "@heroui/react";
import { Check, X } from "lucide-react";

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
    // Cada opção é um cartão; certa e errada ganham a tinta do estado, e o rótulo em pílula (abaixo)
    // diz o que é, porque no alto contraste a tinta some.
    if (!isRevealed) return "surface-card";
    if (index === correctIndex) return "surface-success border-(--success)";
    if (index === value) return "surface-danger border-(--danger)";
    return "surface-card opacity-70";
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
          className={`rounded-lg p-3 ${stateClass(index)}`}
        >
          <Radio.Content className="flex items-center gap-2">
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            <Label>{option}</Label>
            {isRevealed && index === correctIndex ? (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-(--success) px-2.5 py-0.5 text-sm font-bold text-(--success-foreground)">
                <Check aria-hidden="true" className="size-4" /> Correta
              </span>
            ) : null}
            {isRevealed && index === value && index !== correctIndex ? (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-(--danger) px-2.5 py-0.5 text-sm font-bold text-white">
                <X aria-hidden="true" className="size-4" /> Sua resposta
              </span>
            ) : null}
          </Radio.Content>
        </Radio>
      ))}
    </RadioGroup>
  );
}
