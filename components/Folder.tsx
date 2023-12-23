"use client";

interface Props {
  name: String;
  id: Number;
  layout: String;
}

import { Folder } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FolderComponent: React.FC<Props> = ({ name, id, layout }) => {
  if (layout == "grid") {
    return (
      <div className="flex hover:bg-[#E1E5EA] bg-[#EDF2FC] items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors">
        <Folder
          size={28}
          color="#5F6368"
          className="fill-[#5F6368]"
          strokeWidth={3}
        />
        <p className="text-[#5F6368] text-sm font-medium truncate">{name}</p>
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
