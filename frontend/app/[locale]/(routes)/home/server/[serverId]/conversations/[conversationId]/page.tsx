import ConversationContainer from "@/containers/conversation-container/conversation-container";
import { getUserDataFromServer } from "@/core/helpers/server";
import { getConversationService } from "@/core/model/services";
import {
  ConversationResponseType,
  ReturnResponseType,
  UserType,
} from "@/core/types&enums/types";

interface MemberIdPageProps {
  params: Promise<{
    locale: string;
    conversationId: string;
  }>;
}
export default async function MemberIdPage({ params }: MemberIdPageProps) {
  const { conversationId } = await params;

  const getConversation: ReturnResponseType<ConversationResponseType> =
    await getConversationService(conversationId, true, { page: 1, limit: 10 })
      ?.then((res) => res)
      ?.catch((err) => {
        console.log("Error fetching conversation:", err);
        return err?.response?.data; // Handle error appropriately
      });

  if (!getConversation?.is_successful) {
    return <div> {getConversation?.error_msg}</div>; // Display an error message
  }
  const userData = await getUserDataFromServer();

  const otherUser: UserType =
    getConversation?.response?.userOne?.id === userData?.id
      ? getConversation?.response?.userTwo
      : getConversation?.response?.userOne;

  return (
    <>
      <ConversationContainer
        otherUser={otherUser}
        currentUser={userData as UserType}
        messages={getConversation?.response?.messages || []}
        count={getConversation?.response?.count || 0}
      />
    </>
  );
}
