import create from "zustand";

interface LoaderStore {
  loaderRef: HTMLElement | null;
  setLoaderRef: (ref: HTMLElement | null) => void;
  startTopLoader: () => void;
  stopTopLoader: () => void;
}

export const useLoaderStore = create<LoaderStore>((set) => {
  let loaderRef: any = null;

  const startTopLoader = () => {
    loaderRef && loaderRef.continuousStart();
  };

  const stopTopLoader = () => {
    loaderRef && loaderRef.complete();
  };

  return {
    loaderRef,
    startTopLoader,
    stopTopLoader,
    setLoaderRef: (ref: any) => {
      loaderRef = ref;
      set({ loaderRef: ref });
    },
  };
});
