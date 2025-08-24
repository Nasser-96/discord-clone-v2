"use client";

import {
  GridLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect } from "react";

export default function LiveKit() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  useEffect(() => {
    return () => {
      tracks.forEach((track) => {
        if (track) {
          track.participant?.setDisconnected();
        }
      });
    };
  }, [tracks]);

  return (
    <GridLayout tracks={tracks}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
