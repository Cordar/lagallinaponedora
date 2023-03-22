import { type UseFormRegisterReturn } from "react-hook-form";

interface RadioButtonProps {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
}

const RadioButton = ({ id, label, register }: RadioButtonProps) => {
  return (
    <label htmlFor={id} className="flex flex-row gap-4">
      <input id={id} value={id} type="radio" className="peer hidden" {...register} />
      <div className="h-6 w-6 rounded-full border-2 border-green-900 border-opacity-30 bg-white peer-checked:bg-green-500" />
      <p className="text-lg">{label}</p>
    </label>
  );
};

export default RadioButton;
