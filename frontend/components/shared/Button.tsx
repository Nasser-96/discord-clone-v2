import { ButtonHTMLAttributes } from "react";
import ComponentLoader from "./loader";
import { getTransitionClass } from "@/helpers";
import { ColorEnum } from "@/core/types&enums/enums";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  color?: ColorEnum;
}

export default function Button({ color, isLoading, ...props }: ButtonProps) {
  const getColorBackground = () => {
    switch (color) {
      case ColorEnum.PRIMARY:
        return "bg-[#5865F2] hover:bg-[#4752C4]"; // Discord blurple
      case ColorEnum.SECONDARY:
        return "bg-[#2B2D31] hover:bg-[#1E1F22]"; // Sidebar gray
      case ColorEnum.SUCCESS:
        return "bg-[#3BA55D] hover:bg-[#2D7D46]"; // Green
      case ColorEnum.DANGER:
        return "bg-[#ED4245] hover:bg-[#C33B3E]"; // Red
      case ColorEnum.WARNING:
        return "bg-[#FAA61A] hover:bg-[#E09B17]"; // Yellow/orange
      case ColorEnum.DARK:
      default:
        return "bg-[#1E1F22] hover:bg-[#0F0F0F]"; // Dark sidebar background
    }
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 ${getColorBackground()} text-white rounded-lg disabled:cursor-not-allowed focus:outline-none focus:ring-2 relative focus:ring-blue-400 ${
        props.className
      } ${getTransitionClass}`}
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
