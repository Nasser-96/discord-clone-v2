"use client";

import { ChannelType } from "@/core/types&enums/types";
import Button from "../shared/Button";
import { JSX } from "react";
import { ColorEnum } from "@/core/types&enums/enums";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface ChannelNavigationProps {
  title: string;
  channels: ChannelType[];
  icon: JSX.Element;
  buttonColor?: ColorEnum;
}

export default function ChannelNavigation({
  title,
  channels,
  icon,
  buttonColor = ColorEnum.DARK,
}: ChannelNavigationProps) {
  const router = useRouter();
  const { serverId = "", locale = "en" } = useParams<{
    serverId: string;
    locale: string;
  }>();

  const navigateToChannel = (channelId: string) => {
    router.push(`${locale}/${serverId}/${channelId}`);
  };

  return (
    <div className="py-2">
      <h3 className="text-discord-muted px-3">{title}</h3>
      <div className="flex flex-col mt-1">
        {channels.map((channel) => (
          <Button
            key={channel.id}
            type="button"
            color={buttonColor}
            className="w-full flex items-center gap-3 !rounded-none !px-3"
          >
            {icon}
            {channel.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
