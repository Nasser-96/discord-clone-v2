export enum AxiosMethods {
  POST = "post",
  GET = "get",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
  HEAD = "head",
}

export enum PositionEnum {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export enum ColorEnum {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  SUCCESS = "SUCCESS",
  DANGER = "DANGER",
  WARNING = "WARNING",
  DARK = "DARK",
  TRANSPARENT = "TRANSPARENT",
}

export enum ModalSizeEnum {
  XLARGE = "XLARGE",
  LARGE = "LARGE",
  MEDIUM = "MEDIUM",
  SMALL = "SMALL",
}

export enum MemberRoleEnum {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

export enum ChannelTypeEnum {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export enum ChatTypeEnum {
  CONVERSATION = "CONVERSATION",
  CHANNEL = "CHANNEL",
}

export enum DirectMessageEventEnum {
  DIRECT_MESSAGE = "DIRECT_MESSAGE",
  JOIN_CONVERSATION = "JOIN_CONVERSATION",
  DIRECT_MESSAGE_UPDATE = "DIRECT_MESSAGE_UPDATE",
  DELETE_DIRECT_MESSAGE = "DELETE_DIRECT_MESSAGE",
}

export enum ChannelMessageEventEnum {
  CHANNEL_MESSAGE = "CHANNEL_MESSAGE",
  JOIN_CHANNEL = "JOIN_CHANNEL",
  CHANNEL_MESSAGE_UPDATE = "CHANNEL_MESSAGE_UPDATE",
  CHANNEL_MESSAGE_DELETE = "CHANNEL_MESSAGE_DELETE",
}
