"use client";
import { useRoomContext, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";

export default function LiveKit() {
  const room = useRoomContext();
  console.log(room);

  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    if (!room) return;

    const handleDisconnect = () => setIsConnected(false);
    room.on("disconnected", handleDisconnect);

    return () => {
      room.off("disconnected", handleDisconnect);

      // Stop tracks before leaving
      room.localParticipant
        .getTrackPublications()
        .forEach((t) => t.track?.stop());

      // Leave room
      room.disconnect();
    };
  }, [room]);

  if (!isConnected) return null;

  return <VideoConference />;
}
