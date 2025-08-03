import ChannelContainer from "@/containers/channel-container/channel-container";
import {
  channelMessagesService,
  getChannelDataService,
  getSelfMemberService,
} from "@/core/model/services";
import {
  ChannelMessagesResponseType,
  ChannelType,
  MemberResponseType,
  ReturnResponseType,
} from "@/core/types&enums/types";

interface ChannelPageProps {
  params: Promise<{
    locale: string;
    serverId: string;
    channelId: string;
  }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { serverId, channelId } = await params;

  const channelData: ReturnResponseType<ChannelType> =
    await getChannelDataService(channelId, true)?.catch((error) => {
      return error?.response?.data;
    });

  const selfMember: ReturnResponseType<MemberResponseType> =
    await getSelfMemberService(serverId, true)?.catch((error) => {
      return error?.response?.data;
    });

  const channelMessages: ReturnResponseType<ChannelMessagesResponseType> =
    await channelMessagesService(
      channelId,
      {
        page: 1,
        limit: 10, // Adjust the limit as needed
      },
      true
    ).catch(
      (error) =>
        error?.response?.data || {
          is_successful: false,
          error_msg: "Failed to fetch channel messages.",
        }
    );

  if (!channelData?.is_successful) {
    return (
      <>Error: {channelData?.error_msg || "Failed to fetch channel data."}</>
    );
  }

  if (!selfMember?.is_successful) {
    return (
      <>Error: {selfMember?.error_msg || "Failed to fetch member data."}</>
    );
  }

  if (!channelMessages?.is_successful) {
    return (
      <>
        Error:{" "}
        {channelMessages?.error_msg || "Failed to fetch channel messages."}
      </>
    );
  }

  return (
    <ChannelContainer
      channel={channelData?.response}
      selfMember={selfMember?.response}
      channelMessages={channelMessages?.response}
    />
  );
}
