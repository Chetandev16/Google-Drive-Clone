"use client";

interface Props {
  name: string;
  id: Number;
  layout: string;
}

import { Folder } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import Options from "@/components/Options";

const FolderComponent: React.FC<Props> = ({ name, id, layout }) => {
  if (layout == "grid") {
    return (
      <div className="flex hover:bg-[#E1E5EA] bg-[#EDF2FC] items-center justify-between p-2 rounded-md cursor-pointer transition-colors">
        <div className="flex gap-2 justify-center items-center">
          <Folder
            size={28}
            color="#5F6368"
            className="fill-[#5F6368]"
            strokeWidth={3}
          />
          <p className="text-[#5F6368] text-sm font-medium truncate">{name}</p>
        </div>

        <Options name={name} type="Folder" id={id} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Separator />
      <div className="cursor-pointer flex p-3 hover:bg-[#E1E5EA] mt-2 rounded-sm justify-start items-center gap-3">
        <Folder
          size={28}
          color="#5F6368"
          className="fill-[#5F6368]"
          strokeWidth={3}
        />
        <h1 className="text-[#5F6368] text-sm font-medium truncate">{name}</h1>
      </div>
    </div>
  );
};

export default FolderComponent;
