import { type DetailedHTMLProps, type InputHTMLAttributes } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: string;
  label: string;
  errorMessage?: string;
  register?: UseFormRegisterReturn;
  isDisabled?: boolean;
}

const Input = ({ id, label, errorMessage, register, isDisabled, ...rest }: InputProps) => {
  const disabled = isDisabled ? "opacity-40 pointer-events-none" : "";
  return (
    <div className={`relative flex w-full max-w-full flex-col ${disabled}`}>
      <label className="mb-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        key={id}
        className="flex w-full items-center gap-3 whitespace-pre-line rounded-lg border border-slate-900 border-opacity-10 bg-slate-100 p-2 text-base font-medium leading-8 outline-none focus:border-opacity-30 focus-visible:border-opacity-30"
        data-testid={`input_${id}`}
        disabled={isDisabled}
        {...rest}
        {...register}
      />

      {errorMessage && <ErrorMessage id={id} message={errorMessage || "-"} />}
    </div>
  );
};

export default Input;
