"use client";

import { getServerChannelLiveKitTokenService } from "@/core/model/services";
import { ChatTypeEnum } from "@/core/types&enums/enums";
import { ReturnResponseType } from "@/core/types&enums/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ComponentLoader from "../../components/shared/loader";
import {
  ControlBar,
  LiveKitRoom,
  RoomAudioRenderer,
  RoomContext,
  VideoConference,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import LiveKit from "@/components/livekit/livekit";
import { Room } from "livekit-client";

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

  const [roomInstance] = useState(
    () =>
      new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
      })
  );

  const getToken = async () => {
    try {
      const data: ReturnResponseType<{ token: string }> =
        await getServerChannelLiveKitTokenService(serverId, channelId);
      const token = data?.response?.token || "";
      setToken(token || "");
      await roomInstance.connect(
        process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
        token
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getToken();
    return () => {
      roomInstance.disconnect();
    };
  }, [roomInstance, channelId]);

  if (token === "") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ComponentLoader />
      </div>
    );
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div
        data-lk-theme="default"
        className="h-[calc(100%-var(--lk-control-bar-height))] w-full"
      >
        {/* Your custom component with basic video conferencing functionality. */}
        <LiveKit />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}
