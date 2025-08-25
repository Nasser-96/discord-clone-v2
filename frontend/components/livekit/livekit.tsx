"use client";

import {
  AudioConference,
  useRoomContext,
  VideoConference,
} from "@livekit/components-react";
import { useEffect } from "react";

interface LiveKitProps {
  isAudio: boolean;
  setShowLiveKit?: (value: boolean) => void;
}

export default function LiveKit({ isAudio, setShowLiveKit }: LiveKitProps) {
  const room = useRoomContext();

  useEffect(() => {
    room.on("participantConnected", (participant) => {
      console.log("Participant connected:", participant.identity);

      if (setShowLiveKit) setShowLiveKit(true);
    });
    return () => {
      room.off("participantConnected", () => {});
    };
  }),
    [];
  return isAudio ? (
    <div className="h-[calc(100%-var(--lk-control-bar-height))] w-full">
      <AudioConference />
    </div>
  ) : (
    <VideoConference />
  );
}
