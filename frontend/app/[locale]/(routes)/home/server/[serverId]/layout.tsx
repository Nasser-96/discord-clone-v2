import ChannelsSidebarContainer from "@/containers/channels-sidebar-container/channels-sidebar-container";
import { getServerDataService } from "@/core/model/services";
import {
  DecodedTokenType,
  ReturnResponseType,
  ServerDataResponseType,
} from "@/core/types&enums/types";
import { getAuthToken } from "@/core/helpers/auth/token";
import Routes from "@/core/helpers/routes";
import { jwtDecode } from "jwt-decode";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserDataFromServer } from "@/core/helpers/server";

export default async function ServerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string; locale: string }>;
}) {
  const { serverId, locale } = await params;

  // we get user data then pass to container to prevent hydration errors
  const userData = await getUserDataFromServer();

  const serverData: ReturnResponseType<ServerDataResponseType> =
    await getServerDataService(true, serverId)
      .then((res) => res)
      .catch((error) => {
        console.error("Error fetching serverData:", error);
        return undefined;
      });

  if (!serverData || !serverData.response) {
    redirect(Routes(locale ?? "en").home);
  }

  return (
    <div className="flex h-full w-full">
      <ChannelsSidebarContainer
        userData={userData}
        serverData={serverData?.response}
      />
      <div className="flex h-full w-full flex-col">{children}</div>
    </div>
  );
}
