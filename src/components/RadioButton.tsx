import { type UseFormRegisterReturn } from "react-hook-form";

interface RadioButtonProps {
  id: string;
  name: string;
  register: UseFormRegisterReturn;
}

const RadioButton = ({ id, name, register }: RadioButtonProps) => {
  return (
    <label htmlFor={id} className="ml-4 flex flex-row gap-4">
      <input id={id} value={id} type="radio" className="peer hidden" {...register} />
      <div className="h-6 w-6 rounded-full border-2 border-green-900 border-opacity-30 bg-white peer-checked:bg-lgp-green" />
      <p className="text-base">{name}</p>
    </label>
  );
};

export default RadioButton;
