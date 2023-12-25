"use client";
import React, { useEffect } from "react";
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

    const getData = async () => {
      toggleFetchingData(true);
      startTopLoader();
      const response = await axios.get(`/api/get-files-folders/${folderId}`);

      if (response.status == 200) {
        const { data } = response;
        addDataToStore(data.files, data.folders);
      }

      getBreadCrumbData();
    };

    getData();

    return () => {
      toggleFetchingData(true);
      setBreadCrumbData([]);
    };
  }, [
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
