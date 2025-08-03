import { create } from "zustand";
import { ServersResponseType } from "../types&enums/types";

export type ServersStoreType = {
  servers: ServersResponseType[];
  isSideBarOpen: boolean;
  setServers: (servers: ServersResponseType[]) => void;
  toggleSideBar: () => void;
};

export const serversDataStore = create<ServersStoreType>((set) => ({
  servers: [],
  isSideBarOpen: false,
  setServers: (servers: ServersResponseType[]) => set({ servers }),
  toggleSideBar: () => {
    console.log("HERE");

    set((state) => ({ isSideBarOpen: !state.isSideBarOpen }));
  },
}));
