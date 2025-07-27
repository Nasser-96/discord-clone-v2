"use client";

import ConfirmModal from "@/components/confirm-modal/confirm-modal";
import CreateChannelModal from "@/components/create-channel-modal/create-channel-modal";
import CreateUpdateServerModal from "@/components/create-update-server-modal/create-update-server-modal";
import InviteUserModal from "@/components/invite-user-modal/invite-user-modal";
import ManageMembersModal from "@/components/manage-members-modal/manage-members-modal";
import ServerSidebarDropdown from "@/components/server-sidebar-dropdown/server-sidebar-dropdown";
import DropDownMenu from "@/components/shared/DropDownMenu";
import {
  createChannelService,
  deleteServerService,
  leaveServerService,
  removeUserFromServerService,
  updateMemberRoleService,
} from "@/core/model/services";
import { serversDataStore } from "@/core/stores/servers-data.store";
import {
  ChannelTypeEnum,
  ColorEnum,
  MemberRoleEnum,
} from "@/core/types&enums/enums";
import {
  ChannelType,
  CreateChannelRequestType,
  CreateServerResponseType,
  MemberResponseType,
  ReturnResponseType,
  ServerDataResponseType,
  UpdateMemberRoleReturnType,
} from "@/core/types&enums/types";
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown";
import { MdInbox } from "@react-icons/all-files/md/MdInbox";
import { IoIosSearch } from "@react-icons/all-files/io/IoIosSearch";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/shared/Button";
import SearchChannelModal from "@/components/search-channel-modal/search-channel-modal";
import ChannelNavigation from "@/components/channel-navigation/channel-navigation";
import { HiOutlineHashtag } from "@react-icons/all-files/hi/HiOutlineHashtag";
import { AiOutlineAudio } from "@react-icons/all-files/ai/AiOutlineAudio";
import { IoVideocamOutline } from "@react-icons/all-files/io5/IoVideocamOutline";
import { getUserData } from "@/helpers";

interface ChannelsSidebarContainerProps {
  serverData: ServerDataResponseType | undefined;
}

export default function ChannelsSidebarContainer({
  serverData,
}: ChannelsSidebarContainerProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isDeleteServerModalOpen, setIsDeleteServerModalOpen] =
    useState<boolean>(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState<boolean>(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] =
    useState<boolean>(false);
  const [isSearchChannelModalOpen, setIsSearchChannelModalOpen] =
    useState<boolean>(false);
  const [serverDataState, setServerDataState] = useState<
    ServerDataResponseType | undefined
  >(serverData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const { servers, setServers } = serversDataStore();
  const t = useTranslations("common");
  const channelsTrans = useTranslations("searchChannelModal");
  const router = useRouter();
  const confirmMessage = useTranslations("confirmMessage");
  const isAdmin = serverDataState?.memberRole === MemberRoleEnum.ADMIN;
  const isModerator = serverDataState?.memberRole === MemberRoleEnum.MODERATOR;
  const { serverId = "", locale = "en" } = useParams<{
    serverId: string;
    locale: string;
  }>();
  const userData = getUserData();

  const textChannels: ChannelType[] =
    serverDataState?.channels.filter(
      (channel) => channel.channelType === ChannelTypeEnum.TEXT
    ) || [];

  const audioChannels: ChannelType[] =
    serverDataState?.channels.filter(
      (channel) => channel.channelType === ChannelTypeEnum.AUDIO
    ) || [];

  const videoChannels: ChannelType[] =
    serverDataState?.channels.filter(
      (channel) => channel.channelType === ChannelTypeEnum.VIDEO
    ) || [];

  const membersWithoutCurrentUser: MemberResponseType[] =
    serverDataState?.members?.filter((member) => {
      return member.user?.id !== userData?.id;
    }) || [];
  console.log(membersWithoutCurrentUser);

  const newInviteCode = (inviteCode: string) => {
    if (!serverDataState) {
      return;
    }
    setServerDataState({
      ...serverDataState,
      inviteCode: inviteCode,
    });
  };

  const updateServers = (serverData: CreateServerResponseType) => {
    setServerDataState({
      ...(serverDataState as ServerDataResponseType),
      ...serverData,
    });
    const updatedServers = servers.map((server) => {
      if (server.id === serverData.id) {
        return { ...server, ...serverData };
      }
      return server;
    });

    setServers(updatedServers);
  };

  const updateMemberRole = async (memberId: string, role: MemberRoleEnum) => {
    try {
      if (!serverDataState) {
        return;
      }
      const updatedMember: ReturnResponseType<UpdateMemberRoleReturnType> =
        await updateMemberRoleService(serverId, memberId, role);
      const newMembers = serverDataState?.members.map((member) => {
        if (member.id === updatedMember.response?.id) {
          return {
            ...member,
            role: updatedMember.response.role,
          };
        }
        return member;
      });
      setServerDataState({ ...serverDataState, members: newMembers });
    } catch (error) {}
  };

  const deleteMember = async (memberId: string) => {
    setIsLoading(true);
    try {
      if (!serverDataState) {
        return;
      }
      await removeUserFromServerService(serverId, memberId);

      const newMembers = serverDataState?.members.filter(
        (member) => member.id !== memberId
      );

      setServerDataState({ ...serverDataState, members: newMembers });
    } catch (error) {
      console.error("Error deleting member:", error);
    }
    setIsLoading(false);
  };

  const leaveServer = async () => {
    setIsLoading(true);
    try {
      await leaveServerService(serverId);
      const newServers = servers.filter((server) => server.id !== serverId);
      setServers(newServers);

      router.push(`/${locale ?? "en"}/home`);
    } catch (error) {
      console.error("Error leaving server:", error);
    }
    setIsLoading(false);
  };

  const deleteServer = async () => {
    setIsLoading(true);
    try {
      await deleteServerService(serverId);
      const newServers = servers.filter((server) => server.id !== serverId);
      setServers(newServers);

      router.push(`/${locale ?? "en"}/home`);
    } catch (error) {
      console.error("Error deleting server:", error);
    }
    setIsLoading(false);
  };

  const createChannel = async (data: CreateChannelRequestType) => {
    setIsLoading(true);
    try {
      const createdChannel: ReturnResponseType<ChannelType> =
        await createChannelService(data, serverId);
      setIsCreateChannelModalOpen(false);
      const newChannels = [
        ...(serverDataState?.channels ?? []),
        createdChannel.response,
      ];

      setServerDataState({
        ...(serverDataState as ServerDataResponseType),
        channels: newChannels,
      });
    } catch (error) {
      console.error("Error creating channel:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-[#2B2D31] px-2 py-1 min-w-[200px] h-full max-w-xs">
      <DropDownMenu
        listChildren={
          <ServerSidebarDropdown
            isAdmin={isAdmin}
            isModerator={isModerator}
            openInviteModal={() => {
              setIsInviteModalOpen(true);
            }}
            openSettingModal={() => {
              setIsSettingModalOpen(true);
            }}
            openManageModal={() => {
              setIsManageModalOpen(true);
            }}
            openLeaveModal={() => setIsLeaveModalOpen(true)}
            openCreateChannelModal={() => setIsCreateChannelModalOpen(true)}
            openDeleteServerModal={() => setIsDeleteServerModalOpen(true)}
          />
        }
      >
        <div className="flex items-center justify-between gap-4 text-nowrap border-b border-white/30 py-1">
          <p>{serverDataState?.name}</p>
          <FiChevronDown size={30} />
        </div>
      </DropDownMenu>
      <Button
        onClick={() => {
          setIsSearchChannelModalOpen(true);
        }}
        className="w-full mt-3"
      >
        <div className="text-discord-muted flex items-center gap-2">
          <IoIosSearch size={20} />
          {t("search")}
        </div>
      </Button>

      <ChannelNavigation
        channels={textChannels}
        icon={<HiOutlineHashtag size={25} className="inline-block" />}
        title={channelsTrans("text")}
        buttonColor={ColorEnum.SECONDARY}
      />
      <ChannelNavigation
        channels={audioChannels}
        icon={<AiOutlineAudio size={25} className="inline-block" />}
        title={channelsTrans("audio")}
        buttonColor={ColorEnum.SECONDARY}
      />
      <ChannelNavigation
        channels={videoChannels}
        icon={<IoVideocamOutline size={25} className="inline-block" />}
        title={channelsTrans("video")}
        buttonColor={ColorEnum.SECONDARY}
      />
      {serverDataState?.channels?.length === 0 && (
        <div className="h-full flex items-center justify-center flex-col text-xl text-white/50">
          <MdInbox size={40} />
          {t("noDataYet")}
        </div>
      )}
      {isInviteModalOpen && (
        <InviteUserModal
          inviteCode={serverDataState?.inviteCode || ""}
          closeModal={() => {
            setIsInviteModalOpen(false);
          }}
          newInviteCode={newInviteCode}
        />
      )}
      {isSettingModalOpen && (
        <CreateUpdateServerModal
          serverData={serverDataState}
          closeModal={(value) => {
            setIsSettingModalOpen(false);
            if (!value) {
              return;
            }
            updateServers(value);
          }}
        />
      )}
      {isManageModalOpen && (
        <ManageMembersModal
          members={serverDataState?.members || []}
          isAdmin={isAdmin}
          closeModal={() => {
            setIsManageModalOpen(false);
          }}
          isLoading={isLoading}
          updateMemberRole={(memberId, newRole) =>
            updateMemberRole(memberId, newRole)
          }
          deleteMember={deleteMember}
        />
      )}
      {isLeaveModalOpen && (
        <ConfirmModal
          title={confirmMessage("leaveServerTitle")}
          confirmText={confirmMessage("yes")}
          cancelText={confirmMessage("cancel")}
          isLoading={isLoading}
          confirmButtonColor={ColorEnum.DANGER}
          onConfirm={async () => {
            await leaveServer();
            setIsLeaveModalOpen(false);
          }}
          onCancel={() => setIsLeaveModalOpen(false)}
        />
      )}
      {isDeleteServerModalOpen && (
        <ConfirmModal
          title={confirmMessage("deleteServer")}
          confirmText={confirmMessage("yes")}
          cancelText={confirmMessage("cancel")}
          isLoading={isLoading}
          confirmButtonColor={ColorEnum.DANGER}
          onConfirm={async () => {
            await deleteServer();
            setIsDeleteServerModalOpen(false);
          }}
          onCancel={() => setIsDeleteServerModalOpen(false)}
        />
      )}
      {isCreateChannelModalOpen && (
        <CreateChannelModal
          isLoading={isLoading}
          closeModal={() => {
            setIsCreateChannelModalOpen(false);
          }}
          createChannel={createChannel}
        />
      )}
      {isSearchChannelModalOpen && (
        <SearchChannelModal
          textChannels={textChannels}
          audioChannels={audioChannels}
          videoChannels={videoChannels}
          members={membersWithoutCurrentUser || []}
          closeModal={() => {
            setIsSearchChannelModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
