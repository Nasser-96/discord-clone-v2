import { create } from "zustand";
import { ServersResponseType } from "../types&enums/types";

export type ServersStoreType = {
  servers: ServersResponseType[];
  setServers: (servers: ServersResponseType[]) => void;
};

export const serversDataStore = create<ServersStoreType>((set) => ({
  servers: [],
  setServers: (servers: ServersResponseType[]) => set({ servers }),
}));
