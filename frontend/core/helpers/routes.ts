export default function Routes(locale: string) {
  const getHomeRoute = () => `/${locale}/home`;
  const getLoginRoute = () => `/${locale}/login`;
  const getSignupRoute = () => `/${locale}/signup`;
  const getServerRoute = (serverId: string) =>
    `${getHomeRoute()}/server/${serverId}`;
  const getChannelRoute = (serverId: string, channelId: string) =>
    `${getServerRoute(serverId)}/channel/${channelId}`;
  const getConversationRoute = (conversationId: string) =>
    `${getHomeRoute()}/conversations/${conversationId}`;

  return {
    home: getHomeRoute(),
    login: getLoginRoute(),
    signup: getSignupRoute(),
    server: getServerRoute,
    channel: getChannelRoute,
    directConversation: getConversationRoute,
  };
}
