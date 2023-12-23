"use client";

import { FileImage } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface Props {
  id: Number;
  name: String;
  url: String;
  layout: String;
}

const FileViewer: React.FC<Props> = ({ id, name, url, layout }) => {
  if (layout == "grid") {
    return (
      <div className="max-w-xs mx-auto cursor-pointer hover:bg-[#E1E5EA] bg-[#EDF2FC]  rounded-md overflow-hidden shadow-md">
        <div className="p-4 flex justify-start items-center gap-4">
          <FileImage className="h-5 w-5" color="#D93025" strokeWidth={2} />
          <h1 className="text-[#5F6368] text-sm font-medium truncate">
            {name}
          </h1>
        </div>
        <div className="w-full h-[200px] p-1">
          <Image
            src={`${url}`}
            width={1080}
            height={1920}
            alt=""
            className="h-full w-full object-cover"
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
