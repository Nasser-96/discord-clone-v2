"use client";
import { ChatTypeEnum } from "@/core/types&enums/enums";
import { HiOutlineHashtag } from "@react-icons/all-files/hi/HiOutlineHashtag";
import { MdMenu } from "@react-icons/all-files/md/MdMenu";
import { CameraIcon, CameraDisabledIcon } from "@livekit/components-react";
import Button from "../shared/Button";
import { serversDataStore } from "@/core/stores/servers-data.store";
import UserImage from "../user-image/user-image";

interface ChatHeaderProps {
  name: string;
  type: ChatTypeEnum;
  imageUrl?: string;
  isVideoOn?: boolean;
  toggleLiveKit?: () => void;
}

export default function ChatHeader({
  imageUrl,
  name,
  type,
  isVideoOn,
  toggleLiveKit,
}: ChatHeaderProps) {
  const { toggleSideBar } = serversDataStore();

  return (
    <div className="border-b-2 border-neutral-800 w-full p-2 h-fit flex items-center">
      <div className="flex !items-center gap-2">
        <Button className="xl:hidden" onClick={toggleSideBar}>
          <MdMenu size={25} />
        </Button>

        {type === ChatTypeEnum.CHANNEL ? (
          <HiOutlineHashtag size={25} className="text-discord-muted" />
        ) : (
          <UserImage image={imageUrl} />
        )}
        <h1 className="text-2xl font-bold text-white">{name}</h1>
      </div>
      {type === ChatTypeEnum.CONVERSATION && (
        <div className="flex justify-end items-center w-full">
          <Button onClick={toggleLiveKit}>
            {isVideoOn ? <CameraIcon /> : <CameraDisabledIcon />}
          </Button>
        </div>
      )}
    </div>
  );
}
