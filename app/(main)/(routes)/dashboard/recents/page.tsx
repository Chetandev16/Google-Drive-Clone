"use client";

import axios from "axios";
import React, { useEffect } from "react";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";
import { useLayout } from "@/store/use-layout-store";
import Loadar from "@/components/Loadar";
import Nodata from "@/components/Nodata";
import RenderData from "@/components/DashboardLayout/RenderData";
import { isEmpty } from "lodash";

const Recents = () => {
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
    const getSharedFiles = async () => {
      startTopLoader();
      const response = await axios.get("/api/file/get-recents");

      if (response.status == 200) {
        const { data } = response;
        addDataToStore(data.files, data.folders, data.userAccountInfo);
      }

      toggleFetchingData(false);
      stopTopLoader();
    };
    getSharedFiles();

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

  if (isFetchingData) {
    return <Loadar />;
  }

  if (isEmpty(files) && isEmpty(folders)) {
    return <Nodata />;
  }

  return <RenderData folders={folders} files={files} layout={layout} />;
};

export default Recents;
