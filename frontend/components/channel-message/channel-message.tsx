import { ChannelMessageType, UserType } from "@/core/types&enums/types";
import UserImage from "../user-image/user-image";

interface ChannelMessageProps {
  message: ChannelMessageType;
  currentUser: UserType;
}

export default function ChannelMessage({ message }: ChannelMessageProps) {
  return (
    <div className="mb-4 flex w-full items-start rounded-xl px-4 py-3 shadow-sm backdrop-blur-sm">
      <div className="flex-shrink-0">
        <UserImage />
      </div>

      <div className="ml-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-white">
            {message?.member?.user?.username}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-100 leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}
