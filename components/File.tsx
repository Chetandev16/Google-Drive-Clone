"use client";

import { FileArchive, FileImage, PlaySquare } from "lucide-react";
import Image from "next/image";
import { identifyContentType } from "@/lib/getFileType";
import { Separator } from "@/components/ui/separator";
import Options from "@/components/Options";
import { useModal } from "@/store/use-modal-store";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";
import { Play } from "lucide-react";
import axios from "axios";
import { forEach } from "lodash";

interface Props {
  id?: number;
  name: string;
  url: string;
  layout: string;
  stared?: boolean;
  fileInviteCode?: string;
  hideOptions?: boolean;
}

const FileIcon = {
  image: <FileImage className="h-5 w-5" color="#D93025" strokeWidth={2} />,
  video: <PlaySquare className="h-5 w-5" color="#D93025" strokeWidth={2} />,
  other: <FileArchive className="h-5 w-5" color="#D93025" strokeWidth={2} />,
};

const FileViewer: React.FC<Props> = ({
  id,
  name,
  url,
  stared,
  layout,
  fileInviteCode,
  hideOptions = false,
}) => {
  const { startTopLoader, stopTopLoader } = useLoaderStore();
  const { files, addDataToStore } = useDataStore();

  const onClickStar = async (id: number, isStared: boolean) => {
    try {
      startTopLoader();

      const res = await axios.put("/api/file/star/update", {
        isStared,
        fileId: id,
      });

      const { file_id, file_stared } = res.data;

      const updatesFiles = forEach(files, (file) => {
        if (file.id === file_id) {
          file.stared = file_stared;
        }
      });

      addDataToStore(updatesFiles);
    } catch (e) {
    } finally {
      stopTopLoader();
    }
  };

  const getPreivewMedia = () => {
    const type = identifyContentType(url);

    if (type == "image") {
      return (
        <Image
          src={`${url}`}
          width={1080}
          height={1920}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      );
    } else if (type == "video") {
      return (
        <div className="h-full w-full relative">
          <video className="h-full w-full object-cover" src={`${url}`} />
          <Play
            color="#ffffff"
            className="h-5 w-5 absolute top-[50%] left-[45%]"
          />
        </div>
      );
    } else {
      return (
        <div className="h-full w-full flex flex-col justify-center items-center gap-5">
          <FileArchive color="black" className="h-10 w-10" />
          <p className="w-full p-2 truncate text-center">{name}</p>
        </div>
      );
    }
  };

  const { onOpen } = useModal();

  if (layout == "grid") {
    return (
      <div className="max-w-xs mx-auto cursor-pointer hover:bg-[#E1E5EA] bg-[#EDF2FC]  rounded-md overflow-hidden shadow-md">
        <div className="p-4 flex justify-start items-center gap-1 relative">
          {FileIcon[identifyContentType(url)]}
          <h1 className="text-[#5F6368] text-sm font-medium w-[75%] truncate">
            {name}
          </h1>

          {!hideOptions && id && (
            <div className="absolute right-0">
              <Options
                name={name}
                id={id}
                type="File"
                isFileStared={stared}
                onClickStar={onClickStar}
                fileInviteCode={fileInviteCode}
              />
            </div>
          )}
        </div>
        <div
          onClick={() =>
            onOpen("fileViewer", { fileType: "img", fileUrl: url, name: name })
          }
          className="w-full h-[200px] p-1"
        >
          {getPreivewMedia()}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Separator />
      <div
        onClick={() =>
          onOpen("fileViewer", { fileType: "img", fileUrl: url, name: name })
        }
        className="cursor-pointer flex p-3 group-hover:bg-[#E1E5EA] mt-2 rounded-sm justify-between items-center gap-3"
      >
        <div className="flex items-center gap-2">
          {FileIcon[identifyContentType(url)]}
          <p className="hidden sm:flex text-[#5F6368] text-sm font-medium truncate">
            {name}
          </p>
          <p className="uppercase sm:hidden text-[#5F6368] text-sm font-medium truncate">
            {identifyContentType(url)}
          </p>
        </div>

        {!hideOptions && id && (
          <div onClick={(e) => e.stopPropagation()} className="">
            <Options
              name={name}
              id={id}
              type="File"
              isFileStared={stared}
              onClickStar={onClickStar}
              fileInviteCode={fileInviteCode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
