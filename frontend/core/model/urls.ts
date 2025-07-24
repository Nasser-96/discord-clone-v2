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
    updateMemberRole: (serverId: string, memberId: string) =>
      `/member/update-role/${serverId}/${memberId}`,
    removeMember: (serverId: string, memberId: string) =>
      `/member/delete/${serverId}/${memberId}`,
    leaveServer: (serverId: string) => `/member/leave/${serverId}`,
  },
};
