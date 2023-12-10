"use client";
import React, { useState, useEffect, Fragment } from "react";
import NewFolderModal from "@/components/Modal/NewFolderModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;
  return (
    <Fragment>
      <NewFolderModal />
    </Fragment>
  );
};

export default ModalProvider;
