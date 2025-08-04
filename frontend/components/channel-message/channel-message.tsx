"use client";
import {
  ChannelMessageType,
  MemberResponseType,
} from "@/core/types&enums/types";
import UserImage from "../user-image/user-image";
import { FaRegEdit } from "@react-icons/all-files/fa/FaRegEdit";
import { getTransitionClass } from "@/core/helpers";
import { FiTrash } from "@react-icons/all-files/fi/FiTrash";
import { useState } from "react";
import InputField from "../shared/InputField";
import Button from "../shared/Button";
import { ColorEnum, MemberRoleEnum } from "@/core/types&enums/enums";
import { useTranslations } from "next-intl";

interface ChannelMessageProps {
  message: ChannelMessageType;
  currentMember: MemberResponseType;
  editedMessageId: string;
  isUpdateMessageLoading: boolean;
  openDeleteMessageModal: (messageId: string) => void;
  openEditMessageInput: (messageId: string) => void;
  updateMessage: (message: string) => void;
  cancelEditMessage: () => void;
}

export default function ChannelMessage({
  message,
  currentMember,
  editedMessageId,
  isUpdateMessageLoading,
  openDeleteMessageModal,
  openEditMessageInput,
  updateMessage,
  cancelEditMessage,
}: ChannelMessageProps) {
  const t = useTranslations("common");
  const [editedMessage, setEditedMessage] = useState<string>("");
  const isCurrentUserMessage =
    message.member.user.id === currentMember?.user.id;
  const isAdmin =
    currentMember?.role === MemberRoleEnum?.ADMIN ||
    currentMember?.role === MemberRoleEnum.MODERATOR;

  return (
    <div className="mb-4 flex w-full group items-start rounded-xl px-4 py-3 shadow-sm backdrop-blur-sm">
      <div className="flex-shrink-0">
        <UserImage />
      </div>

      <div className="ml-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-white">
            {message?.member?.user?.username}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isCurrentUserMessage && (
            <>
              {editedMessageId !== message.id && (
                <button
                  type="button"
                  title="Edit Channel"
                  className={`text-transparent group-hover:text-discord-text hover:!text-discord-primary ${getTransitionClass}`}
                  onClick={() => {
                    openEditMessageInput(message.id);
                    setEditedMessage(message.content);
                  }}
                >
                  <FaRegEdit size={15} />
                </button>
              )}
            </>
          )}
          {(isCurrentUserMessage || isAdmin) && (
            <button
              type="button"
              title="Delete Channel"
              className={`text-transparent group-hover:text-discord-text hover:!text-discord-danger ${getTransitionClass}`}
              onClick={() => {
                openDeleteMessageModal(message.id);
              }}
            >
              <FiTrash size={15} />
            </button>
          )}
        </div>
        {editedMessageId === message.id ? (
          <div className="mt-2 flex items-center gap-2">
            <InputField
              type="text"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateMessage(editedMessage);
                  setEditedMessage("");
                }
              }}
              className="flex-1"
            />
            <Button
              color={ColorEnum.PRIMARY}
              onClick={() => {
                updateMessage(editedMessage);
                setEditedMessage("");
              }}
              isLoading={isUpdateMessageLoading}
            >
              {t("save")}
            </Button>
            <Button
              color={ColorEnum.DANGER}
              onClick={() => cancelEditMessage()}
            >
              {t("cancel")}
            </Button>
          </div>
        ) : (
          <p className="mt-1 text-sm text-gray-100 leading-relaxed">
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
}
