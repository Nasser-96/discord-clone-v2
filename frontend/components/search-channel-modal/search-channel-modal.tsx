"use client";
import { ChannelType, MemberResponseType } from "@/core/types&enums/types";
import Modal from "../shared/Modal";
import { IoIosSearch } from "@react-icons/all-files/io/IoIosSearch";
import InputField from "../shared/InputField";
import { useEffect, useRef, useState } from "react";
import Button from "../shared/Button";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { HiOutlineHashtag } from "@react-icons/all-files/hi/HiOutlineHashtag";
import { AiOutlineAudio } from "@react-icons/all-files/ai/AiOutlineAudio";
import { IoVideocamOutline } from "@react-icons/all-files/io5/IoVideocamOutline";
import { useTranslations } from "next-intl";
import ChannelNavigation from "../channel-navigation/channel-navigation";
import { ChannelTypeEnum } from "@/core/types&enums/enums";
import MemberChannelList from "../member-channel-list/member-channel-list";

interface SearchChannelModalProps {
  textChannels: ChannelType[];
  audioChannels: ChannelType[];
  videoChannels: ChannelType[];
  members: MemberResponseType[];
  closeModal: () => void;
}

export default function SearchChannelModal({
  textChannels,
  audioChannels,
  videoChannels,
  members,
  closeModal,
}: SearchChannelModalProps) {
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("searchChannelModal");
  const [searchValue, setSearchValue] = useState<string>("");
  const allChannelsFiltered = [
    ...textChannels,
    ...audioChannels,
    ...videoChannels,
  ]?.filter((channel) =>
    channel.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const getTextChannels = () => {
    if (!searchValue) return textChannels;
    return allChannelsFiltered.filter(
      (channel) => channel.channelType === ChannelTypeEnum.TEXT
    );
  };

  const getAudioChannels = () => {
    if (!searchValue) return audioChannels;
    return allChannelsFiltered.filter(
      (channel) => channel.channelType === ChannelTypeEnum.AUDIO
    );
  };

  const getVideoChannels = () => {
    if (!searchValue) return videoChannels;
    return allChannelsFiltered.filter(
      (channel) => channel.channelType === ChannelTypeEnum.VIDEO
    );
  };

  const getMembers = () => {
    if (!searchValue) return members;
    return members.filter((member) =>
      member.user?.username.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  useEffect(() => {
    inputFieldRef.current?.focus();
  }, []);

  return (
    <Modal isPaddingDisabled>
      <div className="bg-[#1e1f22]">
        <div className="flex items-center w-full relative">
          <IoIosSearch
            size={25}
            className="text-discord-muted absolute left-2"
          />
          <InputField
            ref={inputFieldRef}
            className="!px-8 !border-none !rounded-none"
            placeholder={t("searchPlaceholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeModal();
            }}
            className="!absolute right-3 !p-0 !bg-transparent "
          >
            <IoClose />
          </Button>
        </div>
        <div className="w-full h-px bg-discord-muted/10" />
        <div className="flex flex-col">
          {getTextChannels()?.length > 0 && (
            <ChannelNavigation
              channels={getTextChannels()}
              icon={<HiOutlineHashtag size={25} className="inline-block" />}
              title={t("text")}
            />
          )}
          {getAudioChannels()?.length > 0 && (
            <ChannelNavigation
              channels={getAudioChannels()}
              icon={<AiOutlineAudio size={25} className="inline-block" />}
              title={t("audio")}
            />
          )}
          {getVideoChannels()?.length > 0 && (
            <ChannelNavigation
              channels={getVideoChannels()}
              icon={<IoVideocamOutline size={25} className="inline-block" />}
              title={t("video")}
            />
          )}
          {getMembers()?.length > 0 && (
            <MemberChannelList members={members} title={t("members")} />
          )}
        </div>
      </div>
    </Modal>
  );
}
