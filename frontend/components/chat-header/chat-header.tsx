"use client";
import { ChatTypeEnum } from "@/core/types&enums/enums";
import { HiOutlineHashtag } from "@react-icons/all-files/hi/HiOutlineHashtag";
import { MdMenu } from "@react-icons/all-files/md/MdMenu";
import DropDownMenu from "../shared/DropDownMenu";
import Button from "../shared/Button";
import { serversDataStore } from "@/core/stores/servers-data.store";
import UserImage from "../user-image/user-image";

interface ChatHeaderProps {
  serverId?: string;
  name: string;
  type: ChatTypeEnum;
  imageUrl?: string;
}

export default function ChatHeader({
  imageUrl,
  name,
  serverId,
  type,
}: ChatHeaderProps) {
  const { toggleSideBar } = serversDataStore();
  return (
    <div className="border-b-2 border-neutral-800 w-full p-2 h-fit">
      <div className="flex !items-center gap-2">
        <Button className="md:hidden" onClick={toggleSideBar}>
          <MdMenu size={25} />
        </Button>

        {type === ChatTypeEnum.CHANNEL ? (
          <HiOutlineHashtag size={25} className="text-discord-muted" />
        ) : (
          <UserImage image={imageUrl} />
        )}
        <h1 className="text-2xl font-bold text-white">{name}</h1>
      </div>
    </div>
  );
}
