"use client";
import ChannelMessage from "@/components/channel-message/channel-message";
import ConfirmModal from "@/components/confirm-modal/confirm-modal";
import SharedConversationLayout from "@/components/shared-conversation-layout/shared-conversation-layout";
import LoadMoreScroll from "@/components/shared/LoadMoreScroll";
import useSocketIo from "@/core/hooks/useSocket";
import {
  channelMessagesService,
  createMessageService,
  deleteMessageChannelService,
  updateMessageChannelService,
} from "@/core/model/services";
import {
  ChannelMessageEventEnum,
  ChatTypeEnum,
  ColorEnum,
} from "@/core/types&enums/enums";
import {
  ChannelMessagesResponseType,
  ChannelMessageType,
  ChannelType,
  MemberResponseType,
  ReturnResponseType,
} from "@/core/types&enums/types";
import { HiOutlineHashtag } from "@react-icons/all-files/hi/HiOutlineHashtag";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

interface ChannelContainerProps {
  selfMember: MemberResponseType;
  channel: ChannelType;
  channelMessages: ChannelMessagesResponseType; // Adjust type as needed
}

export default function ChannelContainer({
  channel,
  selfMember,
  channelMessages,
}: ChannelContainerProps) {
  const t = useTranslations("channelContainer");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string>("");
  const [messagesState, setMessagesState] = useState<ChannelMessageType[]>(
    channelMessages?.messages || []
  );
  const [deleteMessageId, setDeleteMessageId] = useState<string>("");
  const [isDeleteMessageLoading, setIsDeleteMessageLoading] =
    useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(
    channelMessages?.count || 0
  );
  const currentLenMessagesRef = useRef<number>(
    channelMessages?.messages?.length || 0
  );
  const [isUpdateMessageLoading, setIsUpdateMessageLoading] =
    useState<boolean>(false);
  const { channelId = "" } = useParams<{ channelId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [editedMessageId, setEditedMessageId] = useState<string>("");
  const { socket } = useSocketIo({
    url: `/channel`,
    shouldConnect: true,
  });

  const getChannelMessages = async () => {
    setIsLoading(true);
    try {
      const response = await channelMessagesService(
        channelId,
        {
          page: pageNumber,
          limit: limit,
        },
        false
      );
      if (response.is_successful) {
        setMessagesState((prev) => [...prev, ...response.response.messages]);
        setTotalCount(response.response.count);
        currentLenMessagesRef.current =
          response.response.messages.length + currentLenMessagesRef?.current ||
          0;
      } else {
        console.error("Failed to fetch channel messages:", response.error_msg);
      }
    } catch (error) {
      console.error("Error fetching channel messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    const newMessage: ChannelMessageType = {
      content: message,
      member: {
        user: selfMember?.user, // Assuming selfMember has a user property
      },
      createdAt: new Date(),
      id: Date.now().toString(), // Temporary ID, replace with actual ID from server
    };
    setMessagesState((prev) => [newMessage, ...prev]);
    try {
      const newMessage = await createMessageService(channelId, message);
      if (newMessage.is_successful) {
        // Update the message with the ID from the server
        const updatedMessage = {
          ...newMessage.response,
          member: {
            user: selfMember?.user,
          },
        };

        setMessagesState((prev) =>
          [...prev]?.map((msg) =>
            msg.id === newMessage.response.id ? updatedMessage : msg
          )
        );
        socket?.emit("send-message", updatedMessage);
      } else {
        console.error("Failed to send message:", newMessage.error_msg);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setMessage("");
  };

  const updateMessage = async (newMessage: string) => {
    setIsUpdateMessageLoading(true);
    try {
      const updatedMessage: ReturnResponseType<ChannelMessageType> =
        await updateMessageChannelService(editedMessageId, newMessage);
      if (updatedMessage.is_successful) {
        setMessagesState((prev) =>
          prev.map((msg) =>
            msg.id === editedMessageId
              ? { ...msg, content: updatedMessage.response.content }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error updating message:", error);
    } finally {
      setIsUpdateMessageLoading(false);
      setEditedMessageId("");
    }
  };

  const loadMore = async () => {
    setPageNumber((prev) => prev + 1);
  };

  const deleteMessage = async () => {
    setIsDeleteMessageLoading(true);

    try {
      const deletedMessage = await deleteMessageChannelService(deleteMessageId);
      if (deletedMessage.is_successful) {
        setMessagesState((prev) =>
          prev.filter((msg) => msg.id !== deleteMessageId)
        );
        setDeleteMessageId(""); // Clear the delete message ID after successful deletion
      } else {
        console.log("Failed to delete message:", deletedMessage.error_msg);
      }
    } catch (error) {
      console.log("Error deleting message:", error);
    }
    setIsDeleteMessageLoading(false);
  };

  // ======== Socket Event Handlers ======== START

  const newMessageHandler = (data: ChannelMessageType) => {
    if (data?.member?.user?.id === selfMember?.user?.id) {
      return; // Ignore messages sent by the current user
    }
    setMessagesState((prev) => [data, ...prev]);
  };

  const updateMessageHandler = (data: ChannelMessageType) => {
    if (data?.member?.user?.id === selfMember?.user?.id) {
      return; // Ignore updates from the current user
    }
    setMessagesState((prev) =>
      prev.map((msg) =>
        msg.id === data.id ? { ...msg, content: data.content } : msg
      )
    );
  };

  const handleDeleteMessage = (data: ChannelMessageType) => {
    if (data?.member?.user?.id === selfMember?.user?.id) {
      return; // Ignore deletes from the current user
    }
    setMessagesState((prev) => prev.filter((msg) => msg.id !== data.id));
  };

  useEffect(() => {
    socket?.on(
      ChannelMessageEventEnum.CHANNEL_MESSAGE,
      (data: ChannelMessageType) => {
        newMessageHandler(data);
      }
    );

    socket?.on(ChannelMessageEventEnum.CHANNEL_MESSAGE_UPDATE, (data) => {
      updateMessageHandler(data);
    });
    socket?.on(ChannelMessageEventEnum.CHANNEL_MESSAGE_DELETE, (data) => {
      handleDeleteMessage(data);
    });
    return () => {
      socket?.off(ChannelMessageEventEnum.CHANNEL_MESSAGE);
      socket?.off(ChannelMessageEventEnum.CHANNEL_MESSAGE_UPDATE);
      socket?.off(ChannelMessageEventEnum.CHANNEL_MESSAGE_DELETE);
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("connect", () => {
      if (channelId && socket?.connected) {
        socket?.emit(ChannelMessageEventEnum.JOIN_CHANNEL, {
          channelId,
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
  }, [channelId, socket?.connected]);

  // ======== Socket Event Handlers ======== END

  useEffect(() => {
    if (isMounted) {
      getChannelMessages();
    }
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, [pageNumber, channelId]);

  return (
    <>
      <SharedConversationLayout
        chatType={ChatTypeEnum.CHANNEL}
        inputPlaceholder={t("typeHere")}
        message={message}
        headerTitle={channel?.name}
        sendMessage={sendMessage}
        setMessage={setMessage}
      >
        <div className="flex flex-col-reverse w-full h-full overflow-y-auto p-4">
          {messagesState.map((message) => (
            <Fragment key={message?.id}>
              <ChannelMessage
                currentMember={selfMember}
                message={message}
                editedMessageId={editedMessageId}
                isUpdateMessageLoading={isUpdateMessageLoading}
                openEditMessageInput={setEditedMessageId}
                cancelEditMessage={() => setEditedMessageId("")}
                updateMessage={(newMessage) => {
                  updateMessage(newMessage);
                }}
                openDeleteMessageModal={(setMessageId: string) => {
                  setDeleteMessageId(setMessageId);
                }}
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
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-full bg-discord-muted/15 w-fit">
              <HiOutlineHashtag size={50} className="text-discord-muted" />
            </div>
            <div className="text-2xl flex items-center gap-2">
              <span className="font-semibold text-white">{t("welcomeTo")}</span>{" "}
              <div className="flex items-center">
                <HiOutlineHashtag size={20} />
                {channel?.name}
              </div>
            </div>
            <div className="text-discord-muted">
              {t("startConversation", { channelName: channel?.name })}
            </div>
          </div>
        </div>
      </SharedConversationLayout>
      {deleteMessageId && (
        <ConfirmModal
          cancelText={commonT("cancel")}
          confirmText={commonT("delete")}
          isLoading={isDeleteMessageLoading}
          title={t("confirmMessage")}
          confirmButtonColor={ColorEnum.DANGER}
          onCancel={() => setDeleteMessageId("")}
          onConfirm={() => {
            deleteMessage();
          }}
        />
      )}
    </>
  );
}
