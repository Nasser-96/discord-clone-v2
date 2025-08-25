"use client";
import CreateUpdateServerModal from "@/components/create-update-server-modal/create-update-server-modal";
import ServerNavigation from "@/components/server-navigation-item/server-navigation-item";
import Button from "@/components/shared/Button";
import Skeleton from "@/components/shared/Skeleton";
import { WithTooltip } from "@/components/shared/WithTooltip";
import { serversDataStore } from "@/core/stores/servers-data.store";
import { ColorEnum, PositionEnum } from "@/core/types&enums/enums";
import {
  CreateServerResponseType,
  ServersResponseType,
} from "@/core/types&enums/types";
import { getTransitionClass } from "@/core/helpers";
import { removeAuthToken } from "@/core/helpers/auth/token";
import Routes from "@/core/helpers/routes";
import { IoAddOutline } from "@react-icons/all-files/io5/IoAddOutline";
import { IoLogOutOutline } from "@react-icons/all-files/io5/IoLogOutOutline";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "@/core/hooks/useOutsideClick";

interface HomeLayoutContainerProps {
  serverData: ServersResponseType[]; // Adjust type as necessary
  children: React.ReactNode;
}
export default function HomeLayoutContainer({
  children,
  serverData,
}: HomeLayoutContainerProps) {
  const { servers, isSideBarOpen, setServers, toggleSideBar } =
    serversDataStore();
  const [isServersLoading, setIsServersLoading] = useState<boolean>(true);
  const [isCreateServerModalOpen, setIsCreateServerModalOpen] =
    useState<boolean>(false);
  const t = useTranslations("home");
  const router = useRouter();
  const local = useLocale();
  const ref = useRef<HTMLElement>(null);

  const handleLogout = () => {
    removeAuthToken();
    router.push(Routes(local).login);
  };

  useEffect(() => {
    setServers([...serverData]);
    setIsServersLoading(false);
  }, []);

  const createdServerModalClose = (createdServer: CreateServerResponseType) => {
    const oldServers = servers || [];
    oldServers.push({
      ...createdServer,
      memberCount: 1,
    });
  };
  useOutsideClick({
    isOpen: isSideBarOpen,
    callback: () => {
      toggleSideBar();
    },
    ref: ref,
  });

  return (
    <div className="flex h-full">
      {isSideBarOpen && (
        <div className="w-full fixed xl:hidden bg-black/30 h-full z-10"></div>
      )}
      <nav
        className={`h-full bg-[#212224] p-3 flex flex-col overflow-visible z-10 justify-between items-center fixed w-20 xl:static
            ${getTransitionClass}
            ${isSideBarOpen ? "left-0" : "-left-full"}`}
        ref={ref}
      >
        <div className="flex gap-3 flex-col items-center">
          <WithTooltip position={PositionEnum.RIGHT} text={t("createServer")}>
            <Button
              color={ColorEnum.PRIMARY}
              type="button"
              onClick={() => setIsCreateServerModalOpen(true)}
              className="!rounded-full aspect-square !p-2"
            >
              <IoAddOutline
                size={25}
                className={`${getTransitionClass} text-white`}
              />
            </Button>
          </WithTooltip>
          {isServersLoading ? (
            <>
              <Skeleton className="h-[35px] aspect-square rounded-full" />
              <Skeleton className="h-[35px] aspect-square rounded-full" />
              <Skeleton className="h-[35px] aspect-square rounded-full" />
              <Skeleton className="h-[35px] aspect-square rounded-full" />
            </>
          ) : (
            servers?.map((server: ServersResponseType) => (
              <ServerNavigation key={server.id} serverData={server} />
            ))
          )}
        </div>
        <div>
          <Button
            color={ColorEnum.DANGER}
            className="!rounded-full aspect-square !p-2"
            onClick={handleLogout}
          >
            <IoLogOutOutline
              size={25}
              className={`${getTransitionClass} text-white`}
            />
          </Button>
        </div>
      </nav>
      {children}
      {isCreateServerModalOpen && (
        <CreateUpdateServerModal
          closeModal={(createdServer) => {
            if (createdServer) {
              createdServerModalClose(createdServer);
            }
            setIsCreateServerModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
