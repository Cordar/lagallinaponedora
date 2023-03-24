import { type ButtonHTMLAttributes, type DetailedHTMLProps } from "react";
import Loading from "./Loading";

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Button = ({ label, className, isLoading, isDisabled, ...rest }: ButtonProps) => {
  const loadingClasses = "disabled:text-white disabled:bg-lgp-green";
  const disabledClasses = "disabled:text-black disabled:bg-slate-300";

  const extraClasses = isLoading ? loadingClasses : isDisabled ? disabledClasses : "";

  return (
    <button
      type="submit"
      disabled={isDisabled || isLoading}
      {...rest}
      className={`${
        className ? className : ""
      } flex items-center justify-center rounded-full bg-lgp-green px-4 py-3 text-white ${extraClasses}`}
    >
      {isLoading && <Loading className="absolute" color="text-white" />}

      {label && (
        <p className={`${isLoading ? "opacity-0" : ""} whitespace-nowrap text-lg font-medium tracking-wider`}>
          {label}
        </p>
      )}
    </button>
  );
};

export default Button;
