"use client";
import React, { useState, useEffect, Fragment } from "react";
import NewFolderModal from "@/components/Modal/NewFolderModal";
import { DeleteModal } from "@/components/Modal/DeleteModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;
  return (
    <Fragment>
      <NewFolderModal />
      <DeleteModal />
    </Fragment>
  );
};

export default ModalProvider;
