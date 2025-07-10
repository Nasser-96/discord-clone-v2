import { create } from "zustand";

export type UserStoreType = {
  token: string;
  setToken: (token: string) => void;
  logout: () => void;
};

const useUserStore = create<UserStoreType>((set) => ({
  token: "",

  // setUserData(userData: UserStoreDataType) {
  //   set((state) => {
  //     return { ...state, userData };
  //   });
  // },
  setToken(token: string) {
    set((state) => {
      return { ...state, token };
    });
  },

  logout: () => {
    set((state) => {
      return { ...state, token: "" };
    });

    localStorage.removeItem("access_token");
  },
}));

export default useUserStore;
