import HomeLayoutContainer from "@/containers/home-layout-container/home-layout-container";
import { getMyServersService } from "@/core/model/services";
import { serversDataStore } from "@/core/stores/servers-data.store";
import {
  ReturnResponseType,
  ServersResponseType,
} from "@/core/types&enums/types";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const servers: ReturnResponseType<ServersResponseType[]> =
    await getMyServersService(true)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error("Error fetching servers:", error);
        return [];
      });

  return (
    <HomeLayoutContainer serverData={servers?.response} children={children} />
  );
}
