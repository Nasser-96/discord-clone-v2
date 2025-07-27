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
};

export type SelectFormatType = {
  label: string;
  value: string;
};

export type CreateChannelRequestType = {
  name: string;
  channelType: ChannelTypeEnum;
};
