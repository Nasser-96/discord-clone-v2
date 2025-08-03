"use client";
import { ServersResponseType } from "@/core/types&enums/types";
import { WithTooltip } from "../shared/WithTooltip";
import { PositionEnum } from "@/core/types&enums/enums";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { getTransitionClass } from "@/core/helpers";
import Image from "next/image";
import Routes from "@/core/helpers/routes";

interface ServerNavigationProps {
  serverData: ServersResponseType;
}

export default function ServerNavigationItem({
  serverData,
}: ServerNavigationProps) {
  const local = useLocale();
  const router = useRouter();
  const params = useParams();
  const navigateToServer = () => {
    router?.push(Routes(local).server(serverData.id));
  };

  return (
    <WithTooltip text={serverData.name} position={PositionEnum.RIGHT}>
      <button
        className="group relative flex items-center"
        type="button"
        title={serverData.name}
        onClick={navigateToServer}
      >
        <div
          className={`
        absolute ltr:left-0 rtl:right-0 dark:bg-white bg-discord-muted w-1
        rounded-r-full rounded-l-none
        ${getTransitionClass} 
        ${params?.serverId === serverData?.id ? "h-9" : "h-2 group-hover:h-5"}
      `}
        />
        <div
          className={`
            relative group flex mx-3 h-[35px] aspect-square group-hover:rounded-xl ${getTransitionClass} overflow-hidden
            ${
              params?.serverId === serverData.id ? "rounded-2xl" : "rounded-3xl"
            }
        `}
        >
          <Image
            src={serverData?.image}
            alt="Channel"
            fill
            sizes="auto"
            priority
          />
        </div>
      </button>
    </WithTooltip>
  );
}
