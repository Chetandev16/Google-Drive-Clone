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
import qs from "query-string";

const Recents = () => {
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

  useEffect(
    () => {
      const getRecentsFiles = async (searchKeyword: string) => {
        startTopLoader();

        const url = qs.stringifyUrl({
          url: "/api/file/get-recents",
          query: {
            search: searchKeyword,
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
        getRecentsFiles(searchKeyword);
      }, 1000);

      return () => {
        toggleFetchingData(true);
        clearTimeout(delayTimer);
        resetData();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      searchKeyword,
      refetchData,
      addDataToStore,
      resetData,
      startTopLoader,
      stopTopLoader,
      toggleFetchingData,
    ]
  );

  if (isFetchingData) {
    return <Loadar />;
  }

  if (isEmpty(files)) {
    return <Nodata />;
  }

  return <RenderData folders={[]} files={files} layout={layout} />;
};

export default Recents;
