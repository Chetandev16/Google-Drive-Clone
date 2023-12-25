"use client";

import { useModal } from "@/store/use-modal-store";

import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { FileArchive, Play } from "lucide-react";
import { identifyContentType } from "@/lib/getFileType";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { isEmpty } from "lodash";

const FileViewerModal = () => {
  const { onClose, isOpen, type, data } = useModal();
  const isModalOpen = isOpen && type === "fileViewer";

  if (!data || !data.fileUrl || !data.name) return;

  const { fileUrl, name } = data;

  const getPreivewMedia = () => {
    const type = identifyContentType(fileUrl);

    if (type == "image") {
      return (
        <Image
          src={`${fileUrl}`}
          width={1080}
          height={1920}
          alt=""
          className="max-h-[400px] w-full object-cover"
          loading="lazy"
        />
      );
    } else if (type == "video") {
      return (
        <video
          className="h-[100%] w-full object-cover"
          src={`${fileUrl}`}
          controls
        />
      );
    } else {
      return (
        <div className="h-full w-full flex flex-col justify-center items-center gap-4 my-10">
          <FileArchive color="black" className="h-10 w-10" />
          <p className="w-full p-2 truncate text-center">{name}</p>
        </div>
      );
    }
  };

  const downloadFile = async () => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file. Status: ${response.status}`);
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.style.display = "none";

      anchor.download = name;
      anchor.href = blobUrl;

      document.body.appendChild(anchor);

      anchor.click();

      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      toast.error("Failed to download file");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden !gap-0">
        <div className="w-full">{getPreivewMedia()}</div>
        <DialogFooter className="bg-gray-100 px-6 py-6">
          <div className="flex items-center justify-end w-full">
            <Button onClick={() => downloadFile()}>Download</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewerModal;
