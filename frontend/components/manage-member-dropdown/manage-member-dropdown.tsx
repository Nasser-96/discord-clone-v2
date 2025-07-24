import { useTranslations } from "next-intl";
import DropDownMenuButtonItem from "../shared/DropDownMenuButtonItem";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { IoShieldOutline } from "@react-icons/all-files/io5/IoShieldOutline";
import { MemberRoleEnum } from "@/core/types&enums/enums";

interface ManageMemberDropdownProps {
  role: MemberRoleEnum;
  updateMemberRole: (newRole: MemberRoleEnum) => void;
  deleteMember: () => void;
}

export default function ManageMemberDropdown({
  role,
  updateMemberRole,
  deleteMember,
}: ManageMemberDropdownProps) {
  const t = useTranslations("manageMemberDropdown");
  const isUser = role === MemberRoleEnum.USER;
  const isModerator = role === MemberRoleEnum.MODERATOR;
  return (
    <>
      <DropDownMenuButtonItem
        label={t("user")}
        icon={isUser ? <FaCheck size={10} /> : null}
        action={() => updateMemberRole(MemberRoleEnum.USER)}
      />
      <DropDownMenuButtonItem
        label={t("moderator")}
        icon={isModerator ? <FaCheck size={10} /> : null}
        action={() => updateMemberRole(MemberRoleEnum.MODERATOR)}
      />
      <div className="h-px w-full bg-gray-800" />
      <div className="text-discord-danger">
        <DropDownMenuButtonItem label={t("kick")} action={deleteMember} />
      </div>
    </>
  );
}
