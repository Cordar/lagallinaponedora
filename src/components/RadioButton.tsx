import { type UseFormRegisterReturn } from "react-hook-form";
import { LocaleObject } from "~/utils/locale/Locale";

interface RadioButtonProps {
  id: string;
  name: string;
  register: UseFormRegisterReturn;
  disabled: boolean;
}

const RadioButton = ({ id, name, register, disabled }: RadioButtonProps) => {
  return (
    <label htmlFor={id} className="ml-4 flex flex-row gap-4">
      {!disabled && <input id={id} value={id} type="radio" className="peer hidden" {...register} />}
      {!disabled && (
        <div className="h-6 w-6 rounded-full border-2 border-green-900 border-opacity-30 bg-white peer-checked:bg-lgp-green" />
      )}
      {disabled && (
        <div className="h-6 w-6 rounded-full border-2 border-opacity-30 bg-gray-300 peer-checked:bg-lgp-green" />
      )}
      <p className={`px-2 ${disabled} ? "bg-gray-300":""`}>{name}</p>
    </label>
  );
};

export default RadioButton;
