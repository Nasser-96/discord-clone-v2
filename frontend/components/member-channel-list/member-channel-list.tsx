import { ColorEnum, MemberRoleEnum } from "@/core/types&enums/enums";
import { MemberResponseType } from "@/core/types&enums/types";
import Button from "../shared/Button";
import { HiOutlineShieldCheck } from "@react-icons/all-files/hi/HiOutlineShieldCheck";
import { HiOutlineShieldExclamation } from "@react-icons/all-files/hi/HiOutlineShieldExclamation";

interface MemberChannelListProps {
  title: string;
  members: MemberResponseType[];
  buttonColor?: ColorEnum;
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
}: MemberChannelListProps) {
  return (
    <div className="py-2">
      <h3 className="text-discord-muted px-3">{title}</h3>
      <div className="flex flex-col mt-1">
        {members.map((member) => (
          <Button
            key={member.id}
            type="button"
            color={buttonColor}
            className="w-full flex items-center gap-3 !rounded-none !px-3"
          >
            {roleIcons[member.role]}
            {member.user?.username}
          </Button>
        ))}
      </div>
    </div>
  );
}
