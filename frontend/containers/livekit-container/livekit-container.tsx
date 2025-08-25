"use client";

import {
  getConversationLiveKitTokenService,
  getServerChannelLiveKitTokenService,
} from "@/core/model/services";
import { ChatTypeEnum } from "@/core/types&enums/enums";
import { ReturnResponseType } from "@/core/types&enums/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ComponentLoader from "../../components/shared/loader";
import { LiveKitRoom } from "@livekit/components-react";
import LiveKit from "@/components/livekit/livekit";

import "@livekit/components-styles";

interface LiveKitProps {
  chatType: ChatTypeEnum;
  video: boolean;
  audio: boolean;
  isAudio: boolean;
}

export default function LiveKitContainer({
  chatType,
  isAudio,
  video,
  audio,
}: LiveKitProps) {
  const [token, setToken] = useState<string>("");
  const {
    channelId = "",
    serverId = "",
    conversationId = "",
  } = useParams<{
    serverId?: string;
    channelId?: string;
    conversationId?: string;
  }>();

  const getToken = async () => {
    try {
      const data: ReturnResponseType<{ token: string }> =
        await getServerChannelLiveKitTokenService(serverId, channelId);
      setToken(data?.response?.token || "");
    } catch (error) {
      console.error(error);
    }
  };

  const getConversationToken = async () => {
    try {
      const data: ReturnResponseType<{ token: string }> =
        await getConversationLiveKitTokenService(conversationId);
      setToken(data?.response?.token || "");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (chatType === ChatTypeEnum.CHANNEL) {
      getToken();
    }
    if (chatType === ChatTypeEnum.CONVERSATION) {
      getConversationToken();
    }
    return () => {
      setToken("");
    };
  }, []);

  if (!token) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <ComponentLoader />
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || ""}
      connect={true}
      video={video}
      audio={audio}
    >
      <LiveKit isAudio={isAudio} />
    </LiveKitRoom>
  );
}
