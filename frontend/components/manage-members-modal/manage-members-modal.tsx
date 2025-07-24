import { IoClose } from "@react-icons/all-files/io5/IoClose";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import { useTranslations } from "next-intl";
import { FaRegUserCircle } from "@react-icons/all-files/fa/FaRegUserCircle";
import { HiOutlineShieldExclamation } from "@react-icons/all-files/hi/HiOutlineShieldExclamation";
import { IoSettingsOutline } from "@react-icons/all-files/io5/IoSettingsOutline";
import { HiDotsVertical } from "@react-icons/all-files/hi/HiDotsVertical";
import {
  MemberResponseType,
  ReturnResponseType,
  UpdateMemberRoleReturnType,
} from "@/core/types&enums/types";
import Image from "next/image";
import { ColorEnum, MemberRoleEnum } from "@/core/types&enums/enums";
import DropDownMenu from "../shared/DropDownMenu";
import ManageMemberDropdown from "../manage-member-dropdown/manage-member-dropdown";
import { updateMemberRoleService } from "@/core/model/services";
import { useParams } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "../confirm-modal/confirm-modal";

interface ManageMembersModalProps {
  members: MemberResponseType[];
  isAdmin: boolean;
  isLoading?: boolean;
  closeModal: () => void;
  updateMemberRole: (memberId: string, newRole: MemberRoleEnum) => void;
  deleteMember: (memberId: string) => void;
}

const roleIcon = {
  [MemberRoleEnum.ADMIN]: (
    <HiOutlineShieldExclamation className="text-discord-danger" size={15} />
  ),
  [MemberRoleEnum.MODERATOR]: (
    <IoSettingsOutline className="text-discord-danger" size={15} />
  ),
  [MemberRoleEnum.USER]: null,
};

export default function ManageMembersModal({
  members,
  isAdmin,
  isLoading,
  closeModal,
  updateMemberRole,
  deleteMember,
}: ManageMembersModalProps) {
  const t = useTranslations("manageMembersModal");
  const confirmMessage = useTranslations("confirmMessage");
  const [tempMemberId, setTempMemberId] = useState<string>("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  return (
    <>
      <Modal>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <h1 className="font-bold w-full text-2xl text-center">
              {t("title")}
            </h1>
            <Button onClick={() => closeModal()}>
              <IoClose size={25} />
            </Button>
          </div>
          <h1 className="text-center text-discord-muted">
            {members?.length + " " + t("members")}
          </h1>
          <div className="mt-5">
            <div className="flex flex-col gap-4">
              {members?.map((member) => {
                return (
                  <div
                    className="flex gap-2 items-center"
                    key={`server-member-${member.id}`}
                  >
                    {member?.user?.image ? (
                      <Image
                        alt="Channel"
                        fill
                        sizes="auto"
                        priority
                        src={member?.user?.image}
                      />
                    ) : (
                      <FaRegUserCircle
                        className="text-discord-muted"
                        size={30}
                      />
                    )}
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white">{member?.user?.username}</p>
                          {roleIcon[member?.role]}
                        </div>
                        <p className="text-discord-muted">
                          {member?.user?.email}
                        </p>
                      </div>
                      {member?.role !== MemberRoleEnum.ADMIN && isAdmin && (
                        <DropDownMenu
                          listChildren={
                            <ManageMemberDropdown
                              role={member?.role}
                              updateMemberRole={(role) =>
                                updateMemberRole(member?.id, role)
                              }
                              deleteMember={() => {
                                setTempMemberId(member?.id);
                                setIsConfirmModalOpen(true);
                              }}
                            />
                          }
                        >
                          <HiDotsVertical />
                        </DropDownMenu>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
      {isConfirmModalOpen && (
        <ConfirmModal
          cancelText={confirmMessage("cancel")}
          confirmText={confirmMessage("delete")}
          title={confirmMessage("deleteMemberTitle")}
          isLoading={isLoading}
          confirmButtonColor={ColorEnum.DANGER}
          onCancel={() => {
            setIsConfirmModalOpen(false);
            setTempMemberId("");
          }}
          onConfirm={() => {
            deleteMember(tempMemberId);
            setIsConfirmModalOpen(false);
            setTempMemberId("");
          }}
        />
      )}
    </>
  );
}
