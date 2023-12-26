import { create } from "zustand";

interface DrawerStore {
  id: number;
  name: string;
  url: string;
  stared: boolean;
  fileInviteCode: string;
  onChangeDrawer: (
    id: number,
    name: string,
    url: string,
    stared: boolean,
    fileInviteCode: string
  ) => void;
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  id: 0,
  name: "",
  url: "",
  layout: "",
  stared: false,
  fileInviteCode: "",
  onChangeDrawer: (id, name, url, stared, fileInviteCode) =>
    set({ id, name, url, stared, fileInviteCode }),
}));
