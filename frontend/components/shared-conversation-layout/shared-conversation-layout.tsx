import { AiOutlineSend } from "@react-icons/all-files/ai/AiOutlineSend";
import Button from "../shared/Button";
import InputField from "../shared/InputField";
import ChatHeader from "../chat-header/chat-header";
import { UserType } from "@/core/types&enums/types";
import { ChatTypeEnum } from "@/core/types&enums/enums";
import { HiOutlineHashtag } from "@react-icons/all-files/hi/HiOutlineHashtag";

interface SharedConversationLayoutProps {
  children: React.ReactNode;
  headerTitle: string;
  chatType: ChatTypeEnum;
  inputPlaceholder: string;
  message: string;
  setMessage: (value: string) => void;
  sendMessage: (message: string) => void;
}

export default function SharedConversationLayout({
  children,
  chatType,
  headerTitle,
  inputPlaceholder,
  message,
  setMessage,
  sendMessage,
}: SharedConversationLayoutProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <ChatHeader name={headerTitle} type={chatType} />
      <div className="flex flex-col w-full h-full overflow-y-scroll">
        {children}
      </div>
      <div className="flex items-center">
        <InputField
          placeholder={inputPlaceholder}
          type="text"
          className="rounded-none border-t-2 border-neutral-800 bg-transparent text-white focus:ring-0 focus:border-discord-primary"
          autoComplete="off"
          autoFocus
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim()) {
              e.preventDefault(); // Prevent default form submission
              sendMessage(message);
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          onClick={() => {
            if (!message.trim()) return; // Prevent sending empty messages
            sendMessage(message);
          }}
          disabled={!message.trim()}
        >
          <AiOutlineSend className="text-discord-muted" />
        </Button>
      </div>
    </div>
  );
}
