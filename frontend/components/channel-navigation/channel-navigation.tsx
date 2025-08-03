"use client";

import { ChannelType } from "@/core/types&enums/types";
import Button from "../shared/Button";
import { JSX } from "react";
import { ColorEnum, MemberRoleEnum } from "@/core/types&enums/enums";
import { useParams, useRouter } from "next/navigation";
import { FaRegEdit } from "@react-icons/all-files/fa/FaRegEdit";
import { FiTrash } from "@react-icons/all-files/fi/FiTrash";
import Routes from "@/core/helpers/routes";
import { getTransitionClass } from "@/core/helpers";

interface ChannelNavigationProps {
  title: string;
  channels: ChannelType[];
  icon: JSX.Element;
  buttonColor?: ColorEnum;
  isSideBar?: boolean;
  role?: MemberRoleEnum;
  closeModal?: () => void;
  openUpdateChannelModal?: (channelData: ChannelType) => void;
  setIsDeleteChannelModalOpen?: (channelId: string) => void;
}

export default function ChannelNavigation({
  title,
  channels,
  icon,
  buttonColor = ColorEnum.DARK,
  isSideBar = false,
  role,
  closeModal,
  openUpdateChannelModal,
  setIsDeleteChannelModalOpen,
}: ChannelNavigationProps) {
  const router = useRouter();
  const { serverId = "", locale = "en" } = useParams<{
    serverId: string;
    locale: string;
  }>();

  const navigateToChannel = (channelId: string) => {
    router.push(Routes(locale).channel(serverId, channelId));
    if (closeModal) {
      closeModal();
    }
  };

  const isGeneralChannel = (channel: ChannelType) =>
    channel.name.toLowerCase() === "general";
  const shouldShowButton = (channel: ChannelType) =>
    !isGeneralChannel(channel) && role !== MemberRoleEnum.USER;

  return (
    <div className="py-2">
      <h3 className="text-discord-muted px-3">{title}</h3>
      <div className="flex flex-col mt-1 gap-1">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`flex justify-between group items-center relative`}
          >
            <Button
              type="button"
              color={buttonColor}
              onClick={() => navigateToChannel(channel.id)}
              title={channel.name}
              className="w-full flex items-center !rounded-none !px-3"
            >
              <div className="flex gap-3 w-full">
                {icon}
                <span
                  className={`text-discord-text ${
                    isSideBar ? "truncate whitespace-nowrap max-w-32" : ""
                  }`}
                >
                  {channel.name}
                </span>
              </div>
            </Button>
            {isSideBar && shouldShowButton(channel) && (
              <div className="flex gap-3 absolute right-2">
                <button
                  type="button"
                  title="Edit Channel"
                  className={`hover:text-discord-primary ${getTransitionClass}`}
                  onClick={() => {
                    openUpdateChannelModal && openUpdateChannelModal(channel);
                  }}
                >
                  <FaRegEdit size={15} />
                </button>
                <button
                  type="button"
                  title="Delete Channel"
                  className={`hover:text-discord-danger ${getTransitionClass}`}
                  onClick={() =>
                    setIsDeleteChannelModalOpen &&
                    setIsDeleteChannelModalOpen(channel.id)
                  }
                >
                  <FiTrash size={15} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
