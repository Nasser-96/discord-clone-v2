import { makeRequest } from "../axios/axios";
import { AxiosMethods, MemberRoleEnum } from "../types&enums/enums";
import {
  CreateChannelRequestType,
  CreateServerFormType,
  DynamicValuesType,
  LoginFormType,
  SignUpFormType,
} from "../types&enums/types";
import { urls } from "./urls";

export const SignupService = (data: SignUpFormType) => {
  const newData = {
    username: data.username,
    email: data.email,
    password: data.password,
  };
  return makeRequest({
    url: urls.auth.signup,
    method: AxiosMethods.POST,
    data: newData,
  });
};

export const LoginService = (data: LoginFormType) => {
  return makeRequest({
    url: urls.auth.login,
    method: AxiosMethods.POST,
    data: data,
  });
};

export const uploadImageService = (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  return makeRequest({
    url: urls.upload.image,
    method: AxiosMethods.POST,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createServerService = (data: CreateServerFormType) => {
  return makeRequest({
    url: urls.server.create,
    method: AxiosMethods.POST,
    data: data,
  });
};

export const updateServerService = (
  data: CreateServerFormType,
  serverId: string
) => {
  return makeRequest({
    url: urls.server.update(serverId),
    method: AxiosMethods.PUT,
    data: data,
  });
};

export const getMyServersService = (isServer: boolean) => {
  return makeRequest({
    isServer: isServer,
    url: urls.server.myServers,
    method: AxiosMethods.GET,
  });
};

export const getServerDataService = (isServer: boolean, serverId: string) => {
  return makeRequest({
    isServer: isServer,
    url: urls.server.serverData(serverId),
    method: AxiosMethods.GET,
  });
};

export const updateServerInviteCodeService = (
  isServer: boolean,
  serverId: string
) => {
  return makeRequest({
    isServer: isServer,
    url: urls.server.updateServerInviteCode(serverId),
    method: AxiosMethods.PUT,
  });
};

export const addUserToServerService = (
  isServer: boolean,
  inviteCode: string
) => {
  return makeRequest({
    isServer: isServer,
    url: urls.server.addUser(inviteCode),
    method: AxiosMethods.POST,
  });
};

export const updateMemberRoleService = (
  serverId: string,
  memberId: string,
  newRole: MemberRoleEnum
) => {
  return makeRequest({
    url: urls.member.updateMemberRole(serverId, memberId),
    method: AxiosMethods.PUT,
    data: { role: newRole },
  });
};

export const removeUserFromServerService = (
  serverId: string,
  memberId: string
) => {
  return makeRequest({
    url: urls.member.removeMember(serverId, memberId),
    method: AxiosMethods.DELETE,
  });
};

export const leaveServerService = (serverId: string) => {
  return makeRequest({
    url: urls.member.leaveServer(serverId),
    method: AxiosMethods.DELETE,
  });
};

export const deleteServerService = (serverId: string) => {
  return makeRequest({
    url: urls.server.deleteServer(serverId),
    method: AxiosMethods.DELETE,
  });
};

export const createChannelService = (
  data: CreateChannelRequestType,
  serverId: string
) => {
  return makeRequest({
    url: urls.channel.createChannel(serverId),
    method: AxiosMethods.POST,
    data: data,
  });
};

export const updateChannelService = (
  data: CreateChannelRequestType,
  channelId: string
) => {
  return makeRequest({
    url: urls.channel.updateChannel(channelId),
    method: AxiosMethods.PATCH,
    data: data,
  });
};

export const deleteChannelService = (channelId: string) => {
  return makeRequest({
    url: urls.channel.deleteChannel(channelId),
    method: AxiosMethods.DELETE,
  });
};

export const getChannelDataService = (channelId: string, isServer: boolean) => {
  return makeRequest({
    url: urls.channel.getChannelData(channelId),
    method: AxiosMethods.GET,
    isServer: isServer,
  });
};

export const getSelfMemberService = (serverId: string, isServer: boolean) => {
  return makeRequest({
    url: urls.member.getSelfMember(serverId),
    method: AxiosMethods.GET,
    isServer: isServer,
  });
};

export const getConversationIdService = (targetId: string) => {
  return makeRequest({
    url: urls.conversation.getConversationId(targetId),
    method: AxiosMethods.GET,
  });
};

export const getConversationService = (
  targetId: string,
  isServer: boolean,
  params?: DynamicValuesType
) => {
  return makeRequest({
    url: urls.conversation.getConversation(targetId),
    method: AxiosMethods.GET,
    isServer,
    params: params,
  });
};

export const createDirectMessageService = (
  conversationId: string,
  content: string
) => {
  return makeRequest({
    url: urls["direct-message"].sendMessage(conversationId),
    method: AxiosMethods.POST,
    data: {
      content: content,
    },
  });
};

export const createMessageService = (channelId: string, message: string) => {
  return makeRequest({
    url: urls.messages.createMessage(channelId),
    method: AxiosMethods.POST,
    data: {
      content: message,
    },
  });
};

export const channelMessagesService = (
  channelId: string,
  params?: DynamicValuesType,
  isServer: boolean = false
) => {
  return makeRequest({
    url: urls.channel.getChannelMessages(channelId),
    method: AxiosMethods.GET,
    params: params,
    isServer: isServer,
  });
};

export const updateDirectMessageService = (
  messageId: string,
  content: string
) => {
  return makeRequest({
    url: urls["direct-message"].updateMessage(messageId),
    method: AxiosMethods.PUT,
    data: {
      content: content,
    },
  });
};

export const deleteDirectMessageService = (messageId: string) => {
  return makeRequest({
    url: urls["direct-message"].deleteMessage(messageId),
    method: AxiosMethods.DELETE,
  });
};

export const updateMessageChannelService = (
  messageId: string,
  content: string
) => {
  return makeRequest({
    url: urls.messages.updateMessage(messageId),
    method: AxiosMethods.PUT,
    data: {
      content: content,
    },
  });
};

export const deleteMessageChannelService = (messageId: string) => {
  return makeRequest({
    url: urls.messages.deleteMessage(messageId),
    method: AxiosMethods.DELETE,
  });
};

export const getServerChannelLiveKitTokenService = (
  serverId: string,
  channelId: string
) => {
  return makeRequest({
    url: urls.livekit.getToken(serverId, channelId),
    method: AxiosMethods.GET,
  });
};
