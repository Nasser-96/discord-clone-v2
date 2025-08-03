"use client";
import { useOutsideClick } from "@/core/hooks/useOutsideClick";
import { getTransitionClass } from "@/core/helpers";
import { useRef, useState } from "react";

interface DropDownMenuProps {
  children: React.ReactNode;
  listChildren: React.ReactNode;
}

export default function DropDownMenu({
  children,
  listChildren,
}: DropDownMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const closeDropDown = () => setIsOpen(false);

  useOutsideClick({
    isOpen: isOpen,
    ref: dropDownRef,
    callback: closeDropDown,
  });

  return (
    <div ref={dropDownRef} className="relative rounded-lg">
      <button
        type="button"
        title="drop-down-menu"
        className={`w-full hover:bg-opacity-50 ${getTransitionClass}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
      </button>
      <div className="flex justify-center w-full mt-0 relative">
        <div
          className={`absolute z-50 top-1 bg-discord-bg min-h-12 w-fit overflow-hidden rounded-md shadow drop-shadow ${getTransitionClass} w-[calc(100%-20px)]
        ${isOpen ? "scale-100" : "scale-0"}
          `}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(false);
          }}
        >
          {listChildren}
        </div>
      </div>
    </div>
  );
}
