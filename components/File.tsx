"use client";

import { FileImage } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Options from "./Options";

interface Props {
  id: Number;
  name: string;
  url: string;
  layout: string;
}

const FileViewer: React.FC<Props> = ({ id, name, url, layout }) => {
  if (layout == "grid") {
    return (
      <div className="max-w-xs mx-auto cursor-pointer hover:bg-[#E1E5EA] bg-[#EDF2FC]  rounded-md overflow-hidden shadow-md">
        <div className="p-4 flex justify-start items-center gap-1 relative">
          <FileImage className="h-5 w-5" color="#D93025" strokeWidth={2} />
          <h1 className="text-[#5F6368] text-sm font-medium w-[75%] truncate">
            {name}
          </h1>

          <div className="absolute right-0">
            <Options name={name} id={id} type="File" />
          </div>
        </div>
        <div className="w-full h-[200px] p-1">
          <Image
            src={`${url}`}
            width={1080}
            height={1920}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Separator />
      <div
        onClick={() => window.open(`${url}`, "_blank")}
        className="cursor-pointer flex p-3 hover:bg-[#E1E5EA] mt-2 rounded-sm justify-start items-center gap-3"
      >
        <FileImage className="h-5 w-5" color="#D93025" strokeWidth={2} />
        <h1 className="text-[#5F6368] text-sm font-medium truncate">{name}</h1>
      </div>
    </div>
  );
};

export default FileViewer;
