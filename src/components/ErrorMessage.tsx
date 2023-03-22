import { type DetailedHTMLProps, type HTMLAttributes } from "react";

export interface ErrorMessageProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
  message?: string;
}

const ErrorMessage = ({ message, ...props }: ErrorMessageProps) => {
  return message ? (
    <p {...props} className="text-sm font-bold uppercase text-red-500">
      {message}
    </p>
  ) : null;
};

export default ErrorMessage;
