import { type DetailedHTMLProps, type HTMLAttributes } from "react";
import { RiLoader4Fill } from "react-icons/ri";

export interface LoadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  color?: string;
}

const Loading = ({ className, color, ...props }: LoadingProps) => {
  return (
    <div {...props} className={`${className ? className : ""} flex h-full max-h-80 w-full items-center justify-center`}>
      <RiLoader4Fill className={`${color ? color : ""} relative h-11 w-11 animate-spin p-2 text-slate-600`} />
    </div>
  );
};

export default Loading;
