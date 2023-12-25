import { create } from "zustand";

interface DataState {
  files: any[];
  folders: any[];
  searchKeyword: string;
  refetchData: any;
  breadCrumbData: string[];
  addDataToStore: (files: any[], folders: any[]) => void;
  resetData: () => void;
  setSearchKeyword: (keyword: string) => void;
  isFetchingData: boolean;
  toggleFetchingData: (flag: boolean) => void;
  refetchFilesFolder: (date: Date) => void;
  setBreadCrumbData: (data: string[]) => void;
}

export const useDataStore = create<DataState>((set) => ({
  files: [],
  folders: [],
  isFetchingData: true,
  searchKeyword: "",
  refetchData: null,
  breadCrumbData: [],
  addDataToStore: (files, folders) =>
    set(() => ({ files: [...files], folders: [...folders] })),
  resetData: () => set({ files: [], folders: [] }),
  setSearchKeyword: (keyword) =>
    set({
      searchKeyword: keyword,
    }),
  toggleFetchingData: (flag: boolean) => set({ isFetchingData: flag }),
  refetchFilesFolder: (date: Date) => set({ refetchData: date }),
  setBreadCrumbData: (data: string[]) => set({ breadCrumbData: data }),
}));
