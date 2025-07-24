"use client";
import { useEffect } from "react";
interface useOutsideClickProps {
  ref: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
  callback?: () => void;
}

export const useOutsideClick = ({
  ref,
  isOpen,
  callback,
}: useOutsideClickProps) => {
  useEffect(() => {
    const handleClickedOutside = (e: MouseEvent) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        callback && callback();
      }
    };

    document.addEventListener("mousedown", handleClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handleClickedOutside);
    };
  }, [isOpen]);
  return;
};
