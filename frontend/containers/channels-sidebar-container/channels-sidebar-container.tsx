"use client";

import ConfirmModal from "@/components/confirm-modal/confirm-modal";
import CreateUpdateServerModal from "@/components/create-update-server-modal/create-update-server-modal";
import InviteUserModal from "@/components/invite-user-modal/invite-user-modal";
import ManageMembersModal from "@/components/manage-members-modal/manage-members-modal";
import ServerSidebarDropdown from "@/components/server-sidebar-dropdown/server-sidebar-dropdown";
import DropDownMenu from "@/components/shared/DropDownMenu";
import {
  leaveServerService,
  removeUserFromServerService,
  updateMemberRoleService,
} from "@/core/model/services";
import { serversDataStore } from "@/core/stores/servers-data.store";
import { ColorEnum, MemberRoleEnum } from "@/core/types&enums/enums";
import {
  CreateServerResponseType,
  ReturnResponseType,
  ServerDataResponseType,
  UpdateMemberRoleReturnType,
} from "@/core/types&enums/types";
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown";
import { MdInbox } from "@react-icons/all-files/md/MdInbox";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface ChannelsSidebarContainerProps {
  serverData: ServerDataResponseType | undefined;
}

export default function ChannelsSidebarContainer({
  serverData,
}: ChannelsSidebarContainerProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState<boolean>(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [serverDataState, setServerDataState] = useState<
    ServerDataResponseType | undefined
  >(serverData);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const { servers, setServers } = serversDataStore();
  const t = useTranslations("common");
  const router = useRouter();
  const confirmMessage = useTranslations("confirmMessage");
  const isAdmin = serverDataState?.memberRole === MemberRoleEnum.ADMIN;
  const isModerator = serverDataState?.memberRole === MemberRoleEnum.MODERATOR;
  const { serverId = "", locale = "en" } = useParams<{
    serverId: string;
    locale: string;
  }>();

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
  };

  const leaveServer = async () => {
    try {
      await leaveServerService(serverId);
      const newServers = servers.filter((server) => server.id !== serverId);
      setServers(newServers);

      router.push(`/${locale ?? "en"}/home`);
    } catch (error) {
      console.error("Error leaving server:", error);
    }
  };

  return (
    <div className="bg-[#2B2D31] px-2 py-1 min-w-[160px] h-full max-w-xs">
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
          />
        }
      >
        <div className="flex items-center justify-between gap-4 text-nowrap border-b border-white/30 py-1">
          <p>{serverDataState?.name}</p>
          <FiChevronDown size={30} />
        </div>
      </DropDownMenu>
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
          confirmButtonColor={ColorEnum.DANGER}
          onConfirm={() => {
            leaveServer();
            setIsLeaveModalOpen(false);
          }}
          onCancel={() => setIsLeaveModalOpen(false)}
        />
      )}
    </div>
  );
}
