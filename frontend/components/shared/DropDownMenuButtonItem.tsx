import { getTransitionClass } from "@/helpers";
import { JSX } from "react";

interface DropDownMenuButtonItemProps {
  label: string;
  className?: string;
  disabled?: boolean;
  startIcon?: JSX.Element | null;
  icon?: JSX.Element | null;
  action?: () => void;
}

export default function DropDownMenuButtonItem({
  disabled,
  className,
  label,
  icon,
  startIcon,
  action,
}: DropDownMenuButtonItemProps) {
  return (
    <button
      className={`flex w-full items-center justify-between gap-2 p-2 text-sm bg-gray-950 ${getTransitionClass} hover:!bg-opacity-50 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      type="button"
      disabled={disabled}
      onClick={action}
    >
      <div className="flex gap-1 items-center">
        {startIcon}
        <span>{label}</span>
      </div>
      {icon}
    </button>
  );
}
