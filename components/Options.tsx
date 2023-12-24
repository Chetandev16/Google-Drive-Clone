"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { MoreVertical, Star, Trash } from "lucide-react";
import { useModal } from "@/store/use-modal-store";

interface Props {
  type: string;
  name: string;
  id: Number;
}
const Options: React.FC<Props> = ({ type, name, id }) => {
  const { onOpen } = useModal();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="transparent">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="top">
        <div>
          <div>
            <p
              onClick={() => onOpen("delete", { id, name, deleteType: type })}
              className="cursor-pointer flex gap-1 items-center hover:bg-slate-200 p-2 pl-4 text-sm rounded-md"
            >
              <Trash className="h-4 w-4 text-slate-600" />
              Delete
            </p>
          </div>
          <div>
            <p className="cursor-pointer flex gap-1 items-center hover:bg-slate-200 p-2 pl-4 text-sm rounded-md">
              <Star className="h-4 w-4 text-slate-600" />
              Star
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Options;
