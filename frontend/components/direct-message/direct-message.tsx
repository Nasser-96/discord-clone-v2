"use client";
import { getTransitionClass } from "@/core/helpers";
import { MessageType, UserType } from "@/core/types&enums/types";
import Button from "../shared/Button";
import { ColorEnum } from "@/core/types&enums/enums";
import { FaRegEdit } from "@react-icons/all-files/fa/FaRegEdit";
import { FiTrash } from "@react-icons/all-files/fi/FiTrash";
import InputField from "../shared/InputField";
import { useState } from "react";

interface DirectMessageProps {
  message: MessageType;
  currentUser: UserType;
  editedMessageId: string;
  openEditMessageInput: (messageId: string) => void;
  updateMessage: (messageId: string) => void;
  openDeleteMessageModal: (messageId: string) => void;
}

export default function DirectMessage({
  message,
  currentUser,
  editedMessageId,
  updateMessage,
  openDeleteMessageModal,
  openEditMessageInput,
}: DirectMessageProps) {
  const [editedMessage, setEditedMessage] = useState<string>("");

  return (
    <div
      className={`group flex ${
        message.userId === currentUser.id ? "justify-end" : "justify-start"
      } mb-2 ${getTransitionClass}`}
    >
      <div className="flex items-center gap-3">
        {message.userId === currentUser.id && (
          <div className={`flex items-center gap-2 ${getTransitionClass}`}>
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
          </div>
        )}
        {editedMessageId === message.id ? (
          <div className="flex items-center gap-2">
            <InputField
              type="text"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && editedMessage.trim()) {
                  e.preventDefault(); // Prevent default form submission
                  updateMessage(editedMessage);
                }
              }}
              className="bg-transparent border-b-2 border-discord-primary text-white focus:outline-none"
            />
            <Button
              color={ColorEnum.PRIMARY}
              onClick={() => updateMessage(editedMessage)}
            >
              Save
            </Button>
          </div>
        ) : (
          <div
            className={`p-2 rounded-lg max-w-xs ${
              message.userId === currentUser.id
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            <p>{message.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
