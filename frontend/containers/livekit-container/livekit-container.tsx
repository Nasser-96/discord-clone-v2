"use client";

import { getServerChannelLiveKitTokenService } from "@/core/model/services";
import { ChatTypeEnum } from "@/core/types&enums/enums";
import { ReturnResponseType } from "@/core/types&enums/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ComponentLoader from "../../components/shared/loader";
import {
  LiveKitRoom,
  VideoConference,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import LiveKit from "@/components/livekit/livekit";

interface LiveKitProps {
  chatType: ChatTypeEnum;
  video: boolean;
  audio: boolean;
}

export default function LiveKitContainer({
  chatType,
  video,
  audio,
}: LiveKitProps) {
  const [token, setToken] = useState<string>("");
  const { channelId = "", serverId = "" } = useParams<{
    serverId: string;
    channelId: string;
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

  useEffect(() => {
    getToken();
    return () => {};
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
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      video={video}
      audio={audio}
    >
      <LiveKit />
    </LiveKitRoom>
  );
}
