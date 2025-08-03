import { ChannelTypeEnum, MemberRoleEnum } from "./enums";

export type ReturnResponseType<T> = {
  is_successful: boolean;
  error_msg: string;
  success: string;
  response: T;
};

export type SignUpFormType = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormType = {
  identifier: string;
  password: string;
};

export type DecodedTokenType = {
  id: string;
  username: string;
  email: string;
};

export type UploadImageResponseType = {
  image_url: string;
};

export type CreateServerFormType = {
  name: string;
  image: string;
};

export type CreateServerResponseType = {
  id: string;
  name: string;
  image: string;
  createdAt: Date;
};

export type ServersResponseType = {
  createdAt: Date;
  id: string;
  image: string;
  memberCount: number;
  name: string;
};

export type ServerDataResponseType = {
  channels: ChannelType[];
  createdAt: Date;
  members: MemberResponseType[];
  id: string;
  inviteCode: string;
  image: string;
  memberRole: MemberRoleEnum;
  name: string;
};

export type MemberResponseType = {
  role: MemberRoleEnum;
  id: string;
  user: UserType;
  serverId?: string;
};

export type UserType = {
  id: string;
  image: string;
  username: string;
  email: string;
};

export type UpdateMemberRoleReturnType = {
  id: string;
  userId: string;
  serverId: string;
  role: MemberRoleEnum;
};

export type ChannelType = {
  channelType: ChannelTypeEnum;
  createdAt: Date;
  id: string;
  name: string;
  serverId?: string;
};

export type SelectFormatType = {
  label: string;
  value: string;
};

export type CreateChannelRequestType = {
  name: string;
  channelType: ChannelTypeEnum;
};

export type DynamicValuesType = {
  [key: string]: number | string | boolean | string[] | number[] | unknown;
};

export type ConversationIdResponseType = {
  id: string;
  userOneId: string;
  userTwoId: string;
};

export type ConversationResponseType = {
  userOne: UserType;
  userTwo: UserType;
  messages: MessageType[];
  count: number;
};

export type MessageType = {
  id: string;
  userId: string;
  createdAt: Date;
  content: string;
};

export type MessageSocketType = {
  content: string;
  id: string;
};

export type DirectMessageSocketType = {
  message: MessageSocketType;
  senderId: string;
};

export type ChannelMessageType = {
  id: string;
  content: string;
  createdAt: Date;
  member: {
    user: UserType;
  };
};

export type ChannelMessagesResponseType = {
  messages: ChannelMessageType[];
  count: number;
};
