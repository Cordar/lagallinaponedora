import { type UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import RadioButton from "./RadioButton";

interface RadioGroupProps {
  title: string;
  buttons: { label: string; id: string }[];
  register: UseFormRegisterReturn;
  error?: string;
}

const RadioGroup = ({ title, buttons, register, error }: RadioGroupProps) => {
  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {error && <ErrorMessage message={error} />}
      </div>

      {buttons.map(({ label, id }) => (
        <RadioButton key={id} id={id} label={label} register={register} />
      ))}
    </div>
  );
};

export default RadioGroup;
