"use client";

import axios from "axios";
import qs from "query-string";
import React, { useEffect } from "react";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";
import { useLayout } from "@/store/use-layout-store";
import Loadar from "@/components/Loadar";
import Nodata from "@/components/Nodata";
import RenderData from "@/components/DashboardLayout/RenderData";
import { isEmpty } from "lodash";

const Stared = () => {
  const { startTopLoader, stopTopLoader } = useLoaderStore();

  const {
    files,
    isFetchingData,
    toggleFetchingData,
    resetData,
    addDataToStore,
    refetchData,
    searchKeyword,
  } = useDataStore();
  const { layout } = useLayout();

  useEffect(() => {
    const getStaredFiles = async (search: string) => {
      startTopLoader();

      const url = qs.stringifyUrl({
        url: "/api/file/star/get-files",
        query: {
          search,
        },
      });

      const response = await axios.get(url);

      if (response.status == 200) {
        const { data } = response;
        addDataToStore(data.files, data.folders, data.userAccountInfo);
      }

      toggleFetchingData(false);
      stopTopLoader();
    };

    const delayTimer = setTimeout(() => {
      getStaredFiles(searchKeyword);
    }, 1000);

    return () => {
      clearTimeout(delayTimer);
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
    searchKeyword,
  ]);

  if (isFetchingData) {
    return <Loadar />;
  }

  if (isEmpty(files)) {
    return <Nodata />;
  }

  return <RenderData isStaredTab folders={[]} files={files} layout={layout} />;
};

export default Stared;
