import { create } from "zustand";

interface LayoutStore {
  layout: string;
  onChangeLayout: (layout: string) => void;
}

export const useLayout = create<LayoutStore>((set) => ({
  layout: "grid",
  onChangeLayout: (layout: string) => set({ layout }),
}));
