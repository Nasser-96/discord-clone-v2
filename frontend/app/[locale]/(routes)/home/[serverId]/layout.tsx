import ChannelsSidebarContainer from "@/containers/channels-sidebar-container/channels-sidebar-container";
import { getServerDataService } from "@/core/model/services";
import {
  ReturnResponseType,
  ServerDataResponseType,
} from "@/core/types&enums/types";
import { redirect } from "next/navigation";

export default async function ServerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string; locale: string }>;
}) {
  const { serverId, locale } = await params;

  const serverData: ReturnResponseType<ServerDataResponseType> =
    await getServerDataService(true, serverId)
      .then((res) => res)
      .catch((error) => {
        console.error("Error fetching serverData:", error);
        return undefined;
      });

  if (!serverData || !serverData.response) {
    redirect(`/${locale ?? "en"}/home`);
  }

  return (
    <div className="flex h-full w-full">
      <ChannelsSidebarContainer serverData={serverData?.response} />
      <div className="flex h-full w-full flex-col">{children}</div>
    </div>
  );
}
