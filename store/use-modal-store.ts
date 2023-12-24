import { create } from "zustand";

export type ModalType = "newFolder" | "delete" | "fileViewer";

type DataState = {
  name?: string;
  id?: Number;
  deleteType?: string;
  fileUrl?: string;
  fileType?: string;
};
interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: DataState | null;
  onOpen: (type: ModalType, data?: DataState) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: null,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: null }),
}));
