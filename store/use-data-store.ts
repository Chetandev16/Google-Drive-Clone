import { create } from "zustand";

interface DataState {
  files: any[];
  folders: any[];
  searchKeyword: string;
  refetchData: any;
  addDataToStore: (files: any[], folders: any[]) => void;
  resetData: () => void;
  setSearchKeyword: (keyword: string) => void;
  isFetchingData: boolean;
  toggleFetchingData: (flag: boolean) => void;
  refetchFilesFolder: (date: Date) => void;
}

export const useDataStore = create<DataState>((set) => ({
  files: [],
  folders: [],
  isFetchingData: true,
  searchKeyword: "",
  refetchData: null,
  addDataToStore: (files, folders) =>
    set(() => ({ files: [...files], folders: [...folders] })),
  resetData: () => set({ files: [], folders: [] }),
  setSearchKeyword: (keyword) =>
    set({
      searchKeyword: keyword,
    }),
  toggleFetchingData: (flag: boolean) => set({ isFetchingData: flag }),
  refetchFilesFolder: (date: Date) => set({ refetchData: date }),
}));
