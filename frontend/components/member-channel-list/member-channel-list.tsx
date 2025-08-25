"use client";
import { ColorEnum, MemberRoleEnum } from "@/core/types&enums/enums";
import {
  ConversationIdResponseType,
  MemberResponseType,
  ReturnResponseType,
} from "@/core/types&enums/types";
import Button from "../shared/Button";
import { HiOutlineShieldCheck } from "@react-icons/all-files/hi/HiOutlineShieldCheck";
import { HiOutlineShieldExclamation } from "@react-icons/all-files/hi/HiOutlineShieldExclamation";
import { useParams, useRouter } from "next/navigation";
import Routes from "@/core/helpers/routes";
import Image from "next/image";
import { IoSettingsOutline } from "@react-icons/all-files/io5/IoSettingsOutline";
import { FaRegUserCircle } from "@react-icons/all-files/fa/FaRegUserCircle";
import { getConversationIdService } from "@/core/model/services";
import { useState } from "react";

interface MemberChannelListProps {
  title: string;
  members: MemberResponseType[];
  buttonColor?: ColorEnum;
  isSideBar?: boolean;
  openUpdateMembersModal?: () => void;
}

const roleIcons = {
  [MemberRoleEnum.USER]: null,
  [MemberRoleEnum.MODERATOR]: (
    <HiOutlineShieldCheck className="text-discord-primary" size={20} />
  ),
  [MemberRoleEnum.ADMIN]: (
    <HiOutlineShieldExclamation className="text-discord-danger" size={20} />
  ),
};

export default function MemberChannelList({
  members,
  title,
  buttonColor = ColorEnum.DARK,
  isSideBar = false,
  openUpdateMembersModal,
}: MemberChannelListProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { locale, serverId } = useParams<{
    serverId: string;
    locale: string;
  }>();

  const navigateToMemberConversation = async (targetId: string) => {
    // Why do we need to fetch the conversation ID?
    // Because we need to ensure that the conversation exists before navigating to it.
    // If the conversation does not exist, we will create it.
    // This is a common pattern in chat applications where conversations are created dynamically.
    setIsLoading(true);
    try {
      const response: ReturnResponseType<ConversationIdResponseType> =
        await getConversationIdService(targetId);
      const conversationId = response.response?.id;

      router.push(Routes(locale).directConversation(conversationId, serverId));
    } catch (err) {
      console.error("Error fetching conversation ID:", err);
    }
    setIsLoading(false);
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <h3 className="text-discord-muted px-3">{title}</h3>
        {isSideBar && (
          <Button
            color={buttonColor}
            type="button"
            className="!rounded-none !px-3"
            onClick={openUpdateMembersModal}
          >
            <IoSettingsOutline className="text-discord-text" size={15} />
          </Button>
        )}
      </div>
      <div className="flex flex-col mt-1 gap-1">
        {members.map((member) => (
          <Button
            key={member.id}
            color={buttonColor}
            type="button"
            isLoading={isLoading}
            onClick={() => navigateToMemberConversation(member?.user.id)}
            className="w-full flex items-center gap-3 !rounded-none !px-3"
          >
            {isSideBar ? (
              member?.user?.image ? (
                <Image
                  alt="Channel"
                  fill
                  sizes="auto"
                  priority
                  src={member?.user?.image}
                />
              ) : (
                <FaRegUserCircle className="text-discord-muted" size={30} />
              )
            ) : (
              roleIcons[member.role]
            )}
            {member.user?.username}
          </Button>
        ))}
      </div>
    </div>
  );
}
