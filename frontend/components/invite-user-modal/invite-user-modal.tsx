"use client";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import Modal from "../shared/Modal";
import Button from "../shared/Button";
import { useTranslations } from "next-intl";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { FiCopy } from "@react-icons/all-files/fi/FiCopy";

import { useState } from "react";
import { getTransitionClass } from "@/core/helpers";
import InputField from "../shared/InputField";
import { ColorEnum } from "@/core/types&enums/enums";
import { updateServerInviteCodeService } from "@/core/model/services";
import { useParams } from "next/navigation";
import { ReturnResponseType } from "@/core/types&enums/types";

interface InviteUserModalProps {
  inviteCode: string;
  closeModal: () => void;
  newInviteCode: (value: string) => void;
}
export default function InviteUserModal({
  inviteCode,
  closeModal,
  newInviteCode,
}: InviteUserModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const { serverId }: { serverId: string } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("inviteUserModal");
  const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const generateNewLink = async () => {
    setIsLoading(true);
    try {
      const newLink: ReturnResponseType<{ inviteCode: string }> =
        await updateServerInviteCodeService(false, serverId);
      newInviteCode(newLink.response.inviteCode);
    } catch (error) {
      console.error("Error generating new invite link:", error);
    }
    setIsLoading(false);
  };

  return (
    <Modal>
      <div className="flex flex-col gap-2">
        <div className="flex items-center w-full justify-end">
          <Button onClick={() => closeModal()} className="border-none">
            <IoClose size={25} />
          </Button>
        </div>
        <div className="flex items-center">
          <h1 className="font-bold w-full text-2xl text-center">
            {t("title")}
          </h1>
        </div>
        <p className=" text-lg">{t("linkLabel")}</p>
        <div className="flex items-center h-full gap-x-2">
          <InputField readOnly value={inviteUrl} />
          <div className="relative h-full">
            <Button
              color={ColorEnum.DARK}
              type="button"
              className="h-full py-3"
              onClick={onCopy}
            >
              <FaCheck
                className={`absolute text-green-600 ${
                  copied ? "opacity-100" : "opacity-0"
                } ${getTransitionClass}`}
                size={16}
              />
              <FiCopy
                className={`${
                  copied ? "opacity-0" : "opacity-100"
                } ${getTransitionClass}`}
                size={16}
              />
            </Button>
          </div>
        </div>
        <Button
          onClick={generateNewLink}
          type="button"
          className="w-full"
          disabled={isLoading}
          isLoading={isLoading}
          color={ColorEnum.SECONDARY}
        >
          {t("generateNewLink")}
        </Button>
      </div>
    </Modal>
  );
}
