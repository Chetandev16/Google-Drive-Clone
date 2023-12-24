"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { isEmpty, map } from "lodash";
import axios from "axios";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";
import { useLayout } from "@/store/use-layout-store";
import Loadar from "@/components/Loadar";
import Nodata from "@/components/Nodata";
import Folder from "@/components/Folder";
import FileViewer from "@/components/File";

const Home = () => {
  const { startTopLoader, stopTopLoader } = useLoaderStore();

  const {
    files,
    folders,
    isFetchingData,
    toggleFetchingData,
    resetData,
    addDataToStore,
    refetchData,
  } = useDataStore();

  const { layout } = useLayout();

  useEffect(() => {
    const getData = async () => {
      startTopLoader();
      const response = await axios.get(`/api/get-files-folders/root`);

      if (response.status == 200) {
        const { data } = response;
        addDataToStore(data.files, data.folders);
      }

      toggleFetchingData(false);
      stopTopLoader();
    };
    getData();

    return () => {
      toggleFetchingData(true);
      resetData();
    };
  }, [
    refetchData,
    addDataToStore,
    resetData,
    startTopLoader,
    stopTopLoader,
    toggleFetchingData,
  ]);

  if (isEmpty(files) && isEmpty(folders)) {
    if (isFetchingData) {
      return <Loadar />;
    }
    return <Nodata />;
  }

  const getClassNames = () => {
    if (layout == "grid") {
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6";
    } else {
      return;
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 h-full w-full mb-20">
        {/* Folders */}
        {!isEmpty(folders) && layout == "grid" && (
          <h1 className="text-slate-900 text-md font-semibold">Folders</h1>
        )}
        <div className={getClassNames()}>
          {map(folders, (folder) => {
            return (
              <div
                className={`${cn(layout == "grid" ? "p-4" : "p-1", "w-full")}`}
                key={folder.id}
              >
                <Folder name={folder.name} id={folder.id} layout={layout} />
              </div>
            );
          })}
        </div>

        {/* Files */}
        {!isEmpty(files) && layout == "grid" && (
          <h1 className="text-slate-900 text-md font-semibold">Files</h1>
        )}
        <div className={getClassNames()}>
          {map(files, (file) => {
            return (
              <div
                className={`${cn(layout == "grid" ? "p-4" : "p-1", "w-full")}`}
                key={file.id}
              >
                <FileViewer
                  id={file.id}
                  name={file.name}
                  url={file.uploadedURL}
                  layout={layout}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
