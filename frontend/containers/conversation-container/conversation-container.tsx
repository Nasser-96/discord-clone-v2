"use client";

import ConfirmModal from "@/components/confirm-modal/confirm-modal";
import DirectMessage from "@/components/direct-message/direct-message";
import SharedConversationLayout from "@/components/shared-conversation-layout/shared-conversation-layout";
import LoadMoreScroll from "@/components/shared/LoadMoreScroll";
import useSocketIo from "@/core/hooks/useSocket";
import {
  createDirectMessageService,
  getConversationService,
} from "@/core/model/services";
import {
  ChatTypeEnum,
  ColorEnum,
  DirectMessageEventEnum,
} from "@/core/types&enums/enums";
import {
  ConversationResponseType,
  DirectMessageSocketType,
  MessageType,
  ReturnResponseType,
  UserType,
} from "@/core/types&enums/types";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

interface ConversationContainerProps {
  count: number;
  otherUser: UserType;
  currentUser: UserType;
  messages: MessageType[];
}

export default function ConversationContainer({
  currentUser,
  otherUser,
  messages,
  count,
}: ConversationContainerProps) {
  const t = useTranslations("conversationContainer");
  const [messagesState, setMessagesState] = useState<MessageType[]>(messages);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [editedMessageId, setEditedMessageId] = useState<string>("");
  const [deleteMessageId, setDeleteMessageId] = useState<string>("");
  const limit = 10;
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { conversationId = "" } = useParams<{ conversationId: string }>();
  const [totalCount, setTotalCount] = useState<number>(count || 0);
  const currentLenMessagesRef = useRef<number>(messages?.length || 0);
  const { socket } = useSocketIo({
    url: `/direct-message`,
    shouldConnect: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getMessages = async () => {
    setIsLoading(true);
    try {
      const response: ReturnResponseType<ConversationResponseType> =
        await getConversationService(conversationId, false, {
          page: pageNumber,
          limit: limit,
        });
      setMessagesState((prev) => [
        ...prev,
        ...(response.response?.messages || []),
      ]);
      currentLenMessagesRef.current =
        response?.response?.messages?.length + currentLenMessagesRef?.current ||
        0;
      setTotalCount(response.response?.count || 0);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    setIsLoading(false);
  };

  const loadMore = () => {
    if (currentLenMessagesRef?.current >= totalCount) {
      return; // No more messages to load
    }
    setPageNumber((prev) => prev + 1);
  };

  const sendMessage = async (message: string) => {
    const newMessage: MessageType = {
      id: Date.now().toString(), // Temporary ID, replace with actual ID from server
      content: message,
      userId: currentUser.id,
      createdAt: new Date(),
    };
    setMessagesState((prev) => [newMessage, ...prev]);
    setMessage(""); // Clear the input field after sending

    try {
      await createDirectMessageService(conversationId, message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewMessage = (data: DirectMessageSocketType) => {
    if (data?.senderId === currentUser.id) {
      return; // Ignore messages sent by the current user
    }

    const newMessage: MessageType = {
      id: data.message.id,
      content: data.message.content,
      userId: data.senderId,
      createdAt: new Date(),
    };
    setMessagesState((prev) => [newMessage, ...prev]);
  };

  const openEditMessageInput = (messageId: string) => {
    setEditedMessageId(messageId);
  };

  const updateMessage = (newMessage: string) => {
    // const
    setMessagesState((prev) =>
      prev.map((msg) =>
        msg.id === editedMessageId ? { ...msg, content: newMessage } : msg
      )
    );
    setEditedMessageId("");
  };

  const deleteMessage = (messageId: string) => {
    setMessagesState((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const openDeleteMessageModal = (messageId: string) => {
    setDeleteMessageId(messageId);
  };

  useEffect(() => {
    socket?.on(
      DirectMessageEventEnum.DIRECT_MESSAGE,
      (data: DirectMessageSocketType) => {
        handleNewMessage(data);
      }
    );

    return () => {
      socket?.off(DirectMessageEventEnum.DIRECT_MESSAGE);
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("connect", () => {
      if (conversationId && socket?.connected) {
        socket?.emit(DirectMessageEventEnum.JOIN_CONVERSATION, {
          conversationId,
        });
      }
    });
    socket?.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, [conversationId, socket?.connected]);

  useEffect(() => {
    if (isMounted) {
      getMessages();
    }
    setIsMounted(true);
  }, [conversationId, pageNumber]);

  return (
    <>
      <SharedConversationLayout
        chatType={ChatTypeEnum.CONVERSATION}
        inputPlaceholder={t("typeHere")}
        message={message}
        headerTitle={otherUser?.username}
        sendMessage={sendMessage}
        setMessage={setMessage}
      >
        {messagesState?.length > 0 ? (
          <div className="flex flex-col-reverse w-full h-full overflow-y-auto p-4">
            {messagesState.map((message) => (
              <Fragment key={message?.id}>
                <DirectMessage
                  currentUser={currentUser}
                  message={message}
                  editedMessageId={editedMessageId}
                  openEditMessageInput={openEditMessageInput}
                  updateMessage={updateMessage}
                  openDeleteMessageModal={openDeleteMessageModal}
                />
              </Fragment>
            ))}
            <LoadMoreScroll
              currentPage={pageNumber}
              isLoading={isLoading}
              shouldLoadMore={currentLenMessagesRef.current < totalCount}
              loaderColor={ColorEnum.PRIMARY}
              loadMore={loadMore}
            />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-2xl">
            {t("emptyState")}
          </div>
        )}
      </SharedConversationLayout>
      {deleteMessageId && (
        <ConfirmModal
          cancelText={t("cancel")}
          confirmText={t("deleteMessage")}
          title={t("confirmMessage")}
          onCancel={() => setDeleteMessageId("")}
          confirmButtonColor={ColorEnum.DANGER}
          isLoading={isLoading}
          onConfirm={() => {
            deleteMessage(deleteMessageId);
            setDeleteMessageId("");
          }}
        />
      )}
    </>
  );
}
