"use client";

import { ModalSizeEnum } from "@/core/types&enums/enums";
import { getTransitionClass } from "@/core/helpers";
import { JSX, useEffect, useRef, useState } from "react";

interface ModalProps {
  children: JSX.Element;
  size?: ModalSizeEnum;
  extraClasses?: string;
  isPaddingDisabled?: boolean;
}

export default function Modal({
  children,
  extraClasses = "",
  size,
  isPaddingDisabled = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const randomNumber = Math.random();
  const [isModalAnimationDone, setIsModalAnimationDone] =
    useState<boolean>(false);

  const getModalSizeClass = (): string => {
    switch (size) {
      case ModalSizeEnum.SMALL:
        return "sm:w-[343px]";
      case ModalSizeEnum.MEDIUM:
        return "sm:w-[484px]";
      case ModalSizeEnum.LARGE:
        return "sm:max-w-2xl";
      case ModalSizeEnum.XLARGE:
        return "lg:max-w-[990px]";
      default:
        return "lg:max-w-2xl";
    }
  };

  useEffect(() => {
    // check if modal is shown
    if (modalRef?.current) {
      setTimeout(() => {
        setIsModalAnimationDone(true);
      }, 50);
    } else {
      setIsModalAnimationDone(false);
    }
  }, []);

  return (
    <>
      {/* <!--Overlay Effect--> */}
      <div
        className={`!z-50 fixed inset-0 min-h-full overflow-hidden bg-black/30 backdrop-blur-lg ${getTransitionClass}`}
      />

      <div
        className={`!z-50 fixed inset-0 flex h-full w-full items-center justify-center overflow-hidden bg-black/50 ${getTransitionClass}`}
        ref={modalRef}
      >
        <div
          className={`max-h-800 ${
            isModalAnimationDone ? "scale-100" : "scale-0"
          } relative bottom-0 mx-auto mt-10 w-11/12 max-w-lg rounded-2xl ${
            isPaddingDisabled ? "p-0" : "p-5 sm:p-8"
          } shadow-lg transition-all duration-500 ${getModalSizeClass()} bg-[#2B2D31] ${extraClasses}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
