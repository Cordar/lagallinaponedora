import { type ButtonHTMLAttributes, type DetailedHTMLProps } from "react";
import Loading from "./Loading";

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Button = ({ label, isLoading, isDisabled, ...rest }: ButtonProps) => {
  const loadingClasses = "disabled:text-white disabled:bg-green-600";
  const disabledClasses = "disabled:text-black disabled:bg-slate-300";

  const extraClasses = isLoading ? loadingClasses : isDisabled ? disabledClasses : "";

  return (
    <button
      type="submit"
      disabled={isDisabled || isLoading}
      {...rest}
      className={`relative flex w-full items-center justify-center rounded-full bg-green-600 px-4 py-3 text-white ${extraClasses}`}
    >
      {isLoading && <Loading className="absolute" color="text-white" />}

      {label && (
        <p className={`${isLoading ? "opacity-0" : ""} whitespace-nowrap text-lg font-medium tracking-wide`}>{label}</p>
      )}
    </button>
  );
};

export default Button;
