import { create } from "zustand";

type UserAccountInfo = {
  tier: string;
  email: string;
  filesUploaded: number;
  foldersCreated: number;
  totalFilesLimit: number;
  totalFoldersLimit: number;
};

interface DataState {
  files: any[];
  folders: any[];
  userAccountInfo: UserAccountInfo;
  searchKeyword: string;
  refetchData: any;
  breadCrumbData: string[];
  addDataToStore: (
    files?: any[],
    folders?: any[],
    userAccountInfo?: UserAccountInfo
  ) => void;
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
  userAccountInfo: {
    tier: "FREE",
    email: "",
    filesUploaded: 0,
    foldersCreated: 0,
    totalFilesLimit: 5,
    totalFoldersLimit: 5,
  },
  isFetchingData: true,
  searchKeyword: "",
  refetchData: null,
  breadCrumbData: [],
  addDataToStore: (files, folders, userAccountInfo) =>
    set((state) => ({
      files: files ? [...files] : state.files,
      folders: folders ? [...folders] : state.folders,
      userAccountInfo: userAccountInfo
        ? { ...userAccountInfo }
        : state.userAccountInfo,
    })),
  resetData: () => set({ files: [], folders: [] }),
  setSearchKeyword: (keyword) =>
    set({
      searchKeyword: keyword,
    }),
  toggleFetchingData: (flag: boolean) => set({ isFetchingData: flag }),
  refetchFilesFolder: (date: Date) => set({ refetchData: date }),
  setBreadCrumbData: (data: string[]) => set({ breadCrumbData: data }),
}));
