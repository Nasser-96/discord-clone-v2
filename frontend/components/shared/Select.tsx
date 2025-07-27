"use client";
import { useOutsideClick } from "@/core/hooks/useOutsideClick";
import { SelectFormatType } from "@/core/types&enums/types";
import { getTransitionClass } from "@/helpers";
import { useRef, useState } from "react";
import DropDownMenuButtonItem from "./DropDownMenuButtonItem";
import { IoChevronDownOutline } from "@react-icons/all-files/io5/IoChevronDownOutline";

interface SelectProps {
  label: string;
  values: SelectFormatType[];
  value: string;
  placeholder?: string;
  onClick: (value: string, label?: string) => void;
}

export default function Select({
  values,
  value,
  placeholder,
  label,
  onClick,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dropDownRef = useRef<HTMLButtonElement>(null);

  const closeDropDown = () => setIsOpen(false);

  useOutsideClick({
    isOpen: isOpen,
    ref: dropDownRef,
    callback: closeDropDown,
  });

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="block text-sm text-discord-muted ">{label}</label>
      <button
        type="button"
        className="w-full flex justify-between items-center px-4 py-2 rounded-md bg-[#1e1f22] text-white border border-[#2b2d31]"
        onClick={() => setIsOpen(!isOpen)}
        ref={dropDownRef}
      >
        {value ? (
          <p>{value}</p>
        ) : (
          <p className="text-gray-400">{placeholder}</p>
        )}
        <IoChevronDownOutline className="text-gray-400" size={20} />
      </button>
      <div
        className={`absolute top-full z-50 bg-black min-h-12 w-full overflow-hidden rounded-md shadow drop-shadow ${getTransitionClass} w-[calc(100%-20px)]
        ${isOpen ? "scale-100" : "scale-0"}
          `}
      >
        {values?.map((item, index) => {
          return (
            <DropDownMenuButtonItem
              key={`channel-type-${index}`}
              label={item?.label}
              isGray
              action={() => onClick(item?.value, item?.label)}
            />
          );
        })}
      </div>
    </div>
  );
}
