import { type UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import RadioButton from "./RadioButton";
import { LocaleObject } from "~/utils/locale/Locale";

interface RadioGroupProps {
  title: string;
  buttons: { name: string; id: string; disabled: boolean }[];
  register: UseFormRegisterReturn;
  error?: string;
}

const RadioGroup = ({ title, buttons, register, error }: RadioGroupProps) => {
  return (
    <div className="flex flex-col justify-center gap-4 rounded-lg bg-slate-50 p-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-ellipsis text-lg font-semibold tracking-wide">{title}</h2>
        {error && <ErrorMessage message={error} />}
      </div>

      {buttons.map(({ name, id, disabled }) => (
        <RadioButton key={id} id={id} name={name} register={register} disabled={disabled} />
      ))}
    </div>
  );
};

export default RadioGroup;
