import { PositionEnum } from "@/core/types&enums/enums";
import { JSX, useState } from "react";

export interface WithTooltipProps {
  children: JSX.Element;
  text: string;
  position?: PositionEnum;
}

export const WithTooltip = ({
  children,
  text,
  position = PositionEnum.TOP,
}: WithTooltipProps) => {
  const getPosition = () => {
    switch (position) {
      case PositionEnum.TOP:
        return "bottom-12";
      case PositionEnum.BOTTOM:
        return "top-12";
      case PositionEnum.LEFT:
        return "right-14";
      case PositionEnum.RIGHT:
        return "left-14";
      default:
        return "top-12";
    }
  };

  return (
    <div className="group relative flex max-w-max flex-col items-center justify-center">
      {children}
      <div
        className={`absolute !z-50 ${getPosition()} ml-auto mr-auto min-w-max scale-0 transform rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 group-hover:scale-100`}
      >
        <div
          className={`flex max-w-xs ${
            position === PositionEnum.RIGHT || position === PositionEnum.LEFT
              ? "flex-row"
              : "flex-col"
          } items-center shadow-lg`}
        >
          <div className="rounded bg-gray-800 p-2 text-center text-xs text-white">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};
