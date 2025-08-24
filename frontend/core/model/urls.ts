export const urls = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
  },
  upload: {
    image: "/upload",
  },
  server: {
    create: "/server/create",
    myServers: "/server/my-servers",
    update: (serverId: string) => `/server/${serverId}/update`,
    deleteServer: (serverId: string) => `/server/${serverId}/delete`,
    serverData: (serverId: string) => `/server/${serverId}`,
    updateServerInviteCode: (serverId: string) =>
      `/server/${serverId}/update-invite-code`,
    addUser: (inviteCode: string) => `/server/${inviteCode}/add-user`,
  },
  member: {
    getSelfMember: (serverId: string) => `/member/self/${serverId}`,
    updateMemberRole: (serverId: string, memberId: string) =>
      `/member/update-role/${serverId}/${memberId}`,
    removeMember: (serverId: string, memberId: string) =>
      `/member/delete/${serverId}/${memberId}`,
    leaveServer: (serverId: string) => `/member/leave/${serverId}`,
  },
  channel: {
    getChannelData: (channelId: string) => `/channels/channel/${channelId}`,
    getChannelMessages: (channelId: string) =>
      `/channels/channel/${channelId}/messages`,
    createChannel: (serverId: string) => `/channels/create/${serverId}`,
    updateChannel: (channelId: string) => `/channels/update/${channelId}`,
    deleteChannel: (channelId: string) => `/channels/delete/${channelId}`,
  },
  conversation: {
    getConversationId: (targetId: string) =>
      `/conversations/conversation-id/${targetId}`,
    getConversation: (targetId: string) =>
      `/conversations/conversation/${targetId}`,
  },
  "direct-message": {
    sendMessage: (conversationId: string) =>
      `/direct-message/send/${conversationId}`,
    getMessages: (conversationId: string) =>
      `/direct-message/messages/${conversationId}`,
    updateMessage: (messageId: string) => `/direct-message/update/${messageId}`,
    deleteMessage: (messageId: string) => `/direct-message/delete/${messageId}`,
  },
  messages: {
    createMessage: (channelId: string) =>
      `/messages/channel/${channelId}/create`,
    updateMessage: (messageId: string) => `/messages/update/${messageId}`,
    deleteMessage: (messageId: string) => `/messages/delete/${messageId}`,
  },
  livekit: {
    getToken: (serverId: string, channelId: string) =>
      `/live-kit/serverToken/${serverId}/${channelId}`,
  },
};
