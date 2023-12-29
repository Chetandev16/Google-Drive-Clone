"use client";
import React, { useCallback, useEffect } from "react";
import { isEmpty } from "lodash";
import { useDataStore } from "@/store/use-data-store";
import { useLoaderStore } from "@/store/use-loader-store";
import { useLayout } from "@/store/use-layout-store";
import axios from "axios";
import qs from "query-string";
import Loadar from "@/components/Loadar";
import Nodata from "@/components/Nodata";
import RenderData from "@/components/DashboardLayout/RenderData";

interface Props {
  params: {
    folderId: string;
  };
}

const FolderPage: React.FC<Props> = ({ params }) => {
  const {
    setBreadCrumbData,
    toggleFetchingData,
    addDataToStore,
    isFetchingData,
    files,
    folders,
    refetchData,
    searchKeyword,
  } = useDataStore();

  const { startTopLoader, stopTopLoader } = useLoaderStore();
  const { layout } = useLayout();

  useEffect(() => {
    const { folderId } = params;
    const getBreadCrumbData = async () => {
      try {
        toggleFetchingData(true);
        const query = {
          folderId,
        };

        const url = qs.stringifyUrl({
          url: "/api/folder/get-breadcrumb",
          query,
        });
        const response = await axios.get(url);

        setBreadCrumbData(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        toggleFetchingData(false);
        stopTopLoader();
      }
    };

    const getData = async (search: string, folderId: string) => {
      toggleFetchingData(true);
      startTopLoader();

      const url = qs.stringifyUrl({
        url: `/api/get-files-folders/${folderId}/`,
        query: {
          search,
        },
      });

      const response = await axios.get(url);

      if (response.status == 200) {
        const { data } = response;
        addDataToStore(data.files, data.folders, data.userAccountInfo);
      }

      getBreadCrumbData();
    };

    const delayTimer = setTimeout(() => {
      getData(searchKeyword, folderId);
    }, 1000);

    return () => {
      clearTimeout(delayTimer);
      toggleFetchingData(true);
      setBreadCrumbData([]);
    };
  }, [
    searchKeyword,
    addDataToStore,
    params,
    setBreadCrumbData,
    startTopLoader,
    stopTopLoader,
    toggleFetchingData,
    refetchData,
  ]);

  if (isFetchingData) {
    return <Loadar />;
  }

  if (isEmpty(files) && isEmpty(folders)) {
    return <Nodata />;
  }

  return <RenderData files={files} folders={folders} layout={layout} />;
};

export default FolderPage;
