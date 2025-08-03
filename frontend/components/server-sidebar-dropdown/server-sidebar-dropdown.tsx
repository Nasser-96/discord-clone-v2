import DropDownMenuButtonItem from "../shared/DropDownMenuButtonItem";
import { HiUserAdd } from "@react-icons/all-files/hi/HiUserAdd";
import { IoSettingsOutline } from "@react-icons/all-files/io5/IoSettingsOutline";
import { HiOutlineUsers } from "@react-icons/all-files/hi/HiOutlineUsers";
import { IoIosAddCircleOutline } from "@react-icons/all-files/io/IoIosAddCircleOutline";
import { FiTrash } from "@react-icons/all-files/fi/FiTrash";
import { IoLogOutOutline } from "@react-icons/all-files/io5/IoLogOutOutline";
import { useTranslations } from "next-intl";

interface ServerSidebarDropdownProps {
  isModerator: boolean;
  isAdmin: boolean;
  openInviteModal: () => void;
  openSettingModal: () => void;
  openManageModal: () => void;
  openLeaveModal: () => void;
  openCreateChannelModal: () => void;
  openDeleteServerModal: () => void;
}

export default function ServerSidebarDropdown({
  isModerator,
  isAdmin,
  openInviteModal,
  openSettingModal,
  openManageModal,
  openLeaveModal,
  openCreateChannelModal,
  openDeleteServerModal,
}: ServerSidebarDropdownProps) {
  const t = useTranslations("ServerSidebarDropdown");
  return (
    <div className="text-nowrap z-50">
      {(isModerator || isAdmin) && (
        <DropDownMenuButtonItem
          className="text-indigo-500 dark:text-indigo-400 justify-between"
          icon={<HiUserAdd size={16} />}
          label={t("invite")}
          action={() => {
            openInviteModal();
          }}
        />
      )}
      {isAdmin && (
        <DropDownMenuButtonItem
          className="justify-between"
          icon={<IoSettingsOutline size={16} />}
          label={t("serverSettings")}
          action={() => {
            openSettingModal();
          }}
        />
      )}
      {isAdmin && (
        <DropDownMenuButtonItem
          className="justify-between"
          icon={<HiOutlineUsers size={16} />}
          label={t("manageMembers")}
          action={() => {
            openManageModal();
          }}
        />
      )}
      {(isModerator || isAdmin) && (
        <DropDownMenuButtonItem
          className="justify-between"
          icon={<IoIosAddCircleOutline size={16} />}
          label={t("createChannel")}
          action={() => {
            openCreateChannelModal();
          }}
        />
      )}
      {(isModerator || isAdmin) && (
        <div className="h-px w-full dark:bg-gray-500 bg-gray-300" />
      )}
      {isAdmin && (
        <DropDownMenuButtonItem
          className="text-rose-500 justify-between"
          icon={<FiTrash size={16} />}
          label={t("deleteServer")}
          action={() => {
            openDeleteServerModal();
          }}
        />
      )}
      {!isAdmin && (
        <DropDownMenuButtonItem
          className="text-rose-500 justify-between"
          icon={<IoLogOutOutline size={16} />}
          label={t("leaveServer")}
          action={() => {
            openLeaveModal();
          }}
        />
      )}
    </div>
  );
}
