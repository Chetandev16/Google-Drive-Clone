"use client";

import { useCallback, useEffect } from "react";
import { isEmpty } from "lodash";
import axios from "axios";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";
import { useLayout } from "@/store/use-layout-store";
import Loadar from "@/components/Loadar";
import Nodata from "@/components/Nodata";
import RenderData from "@/components/DashboardLayout/RenderData";
import qs from "query-string";

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
    searchKeyword,
  } = useDataStore();

  const { layout } = useLayout();

  useEffect(() => {
    const getData = async (search: string) => {
      startTopLoader();

      const url = qs.stringifyUrl({
        url: "/api/get-files-folders/root",
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    const delayTimer = setTimeout(() => {
      getData(searchKeyword);
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

  if (isEmpty(files) && isEmpty(folders)) {
    return <Nodata />;
  }

  return <RenderData folders={folders} files={files} layout={layout} />;
};

export default Home;
