import { ButtonHTMLAttributes } from "react";
import ComponentLoader from "./loader";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export default function Button({ isLoading, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 relative focus:ring-blue-400 ${props.className}`}
    >
      {isLoading && (
        <div className="absolute bg-black z-20 bg-opacity-20 h-full w-full left-0 top-0 flex items-center rounded-lg justify-center">
          <ComponentLoader size={20} />
        </div>
      )}
      {props.children}
    </button>
  );
}
