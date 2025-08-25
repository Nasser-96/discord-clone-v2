"use client";

import ConfirmModal from "@/components/confirm-modal/confirm-modal";
import DirectMessage from "@/components/direct-message/direct-message";
import SharedConversationLayout from "@/components/shared-conversation-layout/shared-conversation-layout";
import LoadMoreScroll from "@/components/shared/LoadMoreScroll";
import useSocketIo from "@/core/hooks/useSocket";
import {
  createDirectMessageService,
  deleteDirectMessageService,
  getConversationService,
  updateDirectMessageService,
} from "@/core/model/services";
import {
  ChannelTypeEnum,
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
  const [showLiveKit, setShowLiveKit] = useState<boolean>(false);
  const [isUpdateMessageLoading, setIsUpdateMessageLoading] =
    useState<boolean>(false);
  const [isDeleteMessageLoading, setIsDeleteMessageLoading] =
    useState<boolean>(false);
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
      const ResponseMessage: ReturnResponseType<MessageType> =
        await createDirectMessageService(conversationId, message);
      console.log("ResponseMessage:", ResponseMessage);
      setMessagesState((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, id: ResponseMessage.response.id }
            : msg
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openEditMessageInput = (messageId: string) => {
    setEditedMessageId(messageId);
  };

  const updateMessage = async (newMessage: string) => {
    setIsUpdateMessageLoading(true);
    try {
      const updatedMessage: ReturnResponseType<MessageType> =
        await updateDirectMessageService(editedMessageId, newMessage);
      setMessagesState((prev) =>
        prev.map((msg) =>
          msg.id === editedMessageId
            ? { ...msg, content: updatedMessage?.response?.content }
            : msg
        )
      );
      setEditedMessageId("");
    } catch (error) {
      console.log("Error updating message:", error);
    }
    setIsUpdateMessageLoading(false);
  };

  const deleteMessage = async (messageId: string) => {
    setIsDeleteMessageLoading(true);
    try {
      const deleteMessageResponse: ReturnResponseType<null> =
        await deleteDirectMessageService(messageId);
      if (deleteMessageResponse?.is_successful) {
        setMessagesState((prev) => prev.filter((msg) => msg.id !== messageId));
      }
    } catch (error) {
      console.log("Error deleting message:", error);
    }
    setIsDeleteMessageLoading(false);
  };

  const openDeleteMessageModal = (messageId: string) => {
    setDeleteMessageId(messageId);
  };

  const toggleLiveKit = () => {
    setShowLiveKit((prev) => !prev);
  };

  const getChatClassName = () => {
    const className = "";
  };

  // ============== Socket Event Handlers ============== START
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

  const handleMessageUpdate = (data: DirectMessageSocketType) => {
    if (data?.senderId === currentUser.id) {
      return; // Ignore updates sent by the current user
    }

    const updatedMessage: MessageType = {
      id: data.message.id,
      content: data.message.content,
      userId: data.senderId,
      createdAt: new Date(),
    };
    setMessagesState((prev) =>
      prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
    );
  };

  const handleMessageDelete = (data: DirectMessageSocketType) => {
    if (data?.senderId === currentUser.id) {
      return; // Ignore deletes sent by the current user
    }

    setMessagesState((prev) =>
      prev.filter((msg) => msg.id !== data.message.id)
    );
  };

  useEffect(() => {
    socket?.on(
      DirectMessageEventEnum.DIRECT_MESSAGE,
      (data: DirectMessageSocketType) => {
        handleNewMessage(data);
      }
    );
    socket?.on(
      DirectMessageEventEnum.DIRECT_MESSAGE_UPDATE,
      (data: DirectMessageSocketType) => {
        console.log("Received message update:", data);

        handleMessageUpdate(data);
      }
    );

    socket?.on(
      DirectMessageEventEnum.DELETE_DIRECT_MESSAGE,
      (data: DirectMessageSocketType) => {
        handleMessageDelete(data);
      }
    );

    return () => {
      socket?.off(DirectMessageEventEnum.DIRECT_MESSAGE);
      socket?.off(DirectMessageEventEnum.DIRECT_MESSAGE_UPDATE);
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

  // ============== Socket Event Handlers ============== END

  useEffect(() => {
    if (isMounted) {
      getMessages();
    }
    setIsMounted(true);
  }, [conversationId, pageNumber]);

  return (
    <>
      <SharedConversationLayout
        inputPlaceholder={t("typeHere")}
        message={message}
        headerTitle={otherUser?.username}
        shouldShowLiveKit={showLiveKit}
        chatType={ChatTypeEnum.CONVERSATION}
        channelType={ChannelTypeEnum.VIDEO}
        toggleLiveKit={toggleLiveKit}
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
                  isUpdateMessageLoading={isUpdateMessageLoading}
                  editedMessageId={editedMessageId}
                  cancelEditMessage={() => setEditedMessageId("")}
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
            <div className="flex flex-col gap-3 px-3 mb-4">
              <div className="rounded-full w-fit text-5xl">
                {otherUser?.username}
              </div>
              <div className="text-discord-muted">
                {t("startConversation", {
                  username: otherUser?.username,
                })}
              </div>
            </div>
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
          isLoading={isDeleteMessageLoading}
          onConfirm={() => {
            deleteMessage(deleteMessageId);
            setDeleteMessageId("");
          }}
        />
      )}
    </>
  );
}
