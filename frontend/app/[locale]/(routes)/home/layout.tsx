"use client";

import Button from "@/components/shared/Button";
import { IoAddOutline } from "@react-icons/all-files/io5/IoAddOutline";
import { WithTooltip } from "@/components/shared/WithTooltip";
import { ColorEnum, PositionEnum } from "@/core/types&enums/enums";
import { useTranslations } from "next-intl";
import { getTransitionClass } from "@/helpers";
import Modal from "@/components/shared/Modal";
import { useState } from "react";
import CreateServerModal from "@/components/create-server-modal/create-server-modal";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCreateServerModalOpen, setIsCreateServerModalOpen] =
    useState<boolean>(false);
  const t = useTranslations("home");

  return (
    <div className="flex h-full">
      <nav className="h-full bg-[#2B2D31] p-3 flex flex-col me-3 overflow-visible z-10">
        <WithTooltip position={PositionEnum.RIGHT} text={t("createServer")}>
          <Button
            color={ColorEnum.DARK}
            type="button"
            onClick={() => setIsCreateServerModalOpen(true)}
            className="!rounded-full aspect-square !p-2"
          >
            <IoAddOutline
              size={25}
              className={`${getTransitionClass} text-white`}
            />
          </Button>
        </WithTooltip>
      </nav>
      {children}
      {isCreateServerModalOpen && (
        <CreateServerModal
          closeModal={() => setIsCreateServerModalOpen(false)}
        />
      )}
    </div>
  );
}
