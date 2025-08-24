import { AiOutlineSend } from "@react-icons/all-files/ai/AiOutlineSend";
import Button from "../shared/Button";
import InputField from "../shared/InputField";
import ChatHeader from "../chat-header/chat-header";
import { ChannelTypeEnum, ChatTypeEnum } from "@/core/types&enums/enums";
import LiveKitContainer from "../../containers/livekit-container/livekit-container";

interface SharedConversationLayoutProps {
  children: React.ReactNode;
  headerTitle: string;
  channelType: ChannelTypeEnum;
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
  channelType,
  setMessage,
  sendMessage,
}: SharedConversationLayoutProps) {
  const shouldGetFullWidth = channelType !== ChannelTypeEnum.VIDEO;
  return (
    <div className="h-full w-full flex flex-col">
      <ChatHeader name={headerTitle} type={chatType} />
      <div className="h-full flex">
        {channelType === ChannelTypeEnum.VIDEO && (
          <div className="w-3/4">
            <LiveKitContainer chatType={chatType} video={false} audio={false} />
          </div>
        )}
        <div
          className={`flex flex-col h-full overflow-y-scroll ${
            shouldGetFullWidth ? "w-full" : "w-1/4"
          }`}
        >
          {children}
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
      </div>
    </div>
  );
}
