"use client";
import ChannelMessage from "@/components/channel-message/channel-message";
import ChatHeader from "@/components/chat-header/chat-header";
import SharedConversationLayout from "@/components/shared-conversation-layout/shared-conversation-layout";
import Button from "@/components/shared/Button";
import InputField from "@/components/shared/InputField";
import LoadMoreScroll from "@/components/shared/LoadMoreScroll";
import useSocketIo from "@/core/hooks/useSocket";
import {
  channelMessagesService,
  createMessageService,
} from "@/core/model/services";
import {
  ChannelMessageEventEnum,
  ChatTypeEnum,
  ColorEnum,
  DirectMessageEventEnum,
} from "@/core/types&enums/enums";
import {
  ChannelMessagesResponseType,
  ChannelMessageType,
  ChannelType,
  MemberResponseType,
} from "@/core/types&enums/types";
import { AiOutlineSend } from "@react-icons/all-files/ai/AiOutlineSend";
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
  const [message, setMessage] = useState<string>("");
  const [messagesState, setMessagesState] = useState<ChannelMessageType[]>(
    channelMessages?.messages || []
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(
    channelMessages?.count || 0
  );
  const currentLenMessagesRef = useRef<number>(
    channelMessages?.messages?.length || 0
  );
  const { channelId = "" } = useParams<{ channelId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
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

  const loadMore = async () => {
    setPageNumber((prev) => prev + 1);
  };

  useEffect(() => {
    socket?.on(
      ChannelMessageEventEnum.CHANNEL_MESSAGE,
      (data: ChannelMessageType) => {
        if (data?.member?.user?.id === selfMember?.user?.id) {
          return; // Ignore messages sent by the current user
        }
        setMessagesState((prev) => [data, ...prev]);
      }
    );
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
    <SharedConversationLayout
      chatType={ChatTypeEnum.CHANNEL}
      inputPlaceholder={t("typeHere")}
      message={message}
      headerTitle={channel?.name}
      sendMessage={sendMessage}
      setMessage={setMessage}
    >
      {messagesState?.length > 0 ? (
        <div className="flex flex-col-reverse w-full h-full overflow-y-auto p-4">
          {messagesState.map((message) => (
            <Fragment key={message?.id}>
              <ChannelMessage
                currentUser={selfMember?.user}
                message={message}
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
  );
}
