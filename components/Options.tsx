"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Forward, Info, MoreVertical, Pencil, Star, Trash } from "lucide-react";
import { useModal } from "@/store/use-modal-store";
import { cn } from "@/lib/utils";
import { useDrawerStore } from "@/store/use-file-drawer-store";

interface Props {
  type: string;
  name: string;
  id: number;
  onClickEdit?: (id: number) => void;
  onClickStar?: (id: number, isStared: boolean) => void;
  isFileStared?: boolean;
  fileInviteCode?: string;
  onClickInfo?: () => void;
}

const Options: React.FC<Props> = ({
  type,
  name,
  id,
  onClickEdit,
  onClickStar,
  onClickInfo,
  isFileStared,
  fileInviteCode,
}) => {
  const { onOpen } = useModal();
  const { url, stared } = useDrawerStore();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="transparent">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="top">
        <div>
          {type === "File" && onClickInfo && (
            <div>
              <Sheet>
                <SheetTrigger
                  onClick={() => onClickInfo()}
                  className="cursor-pointer w-full flex gap-1 items-center hover:bg-slate-200 p-2 pl-4 text-sm rounded-md"
                >
                  <Info className="h-4 w-4 text-slate-600" />
                  Info
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{name}</SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          )}
          {type === "File" && (
            <div>
              <p
                onClick={() =>
                  onOpen("share", {
                    fileInviteCode,
                    id,
                  })
                }
                className="cursor-pointer flex gap-1 items-center hover:bg-slate-200 p-2 pl-4 text-sm rounded-md"
              >
                <Forward className="h-4 w-4 text-slate-600" />
                Share
              </p>
            </div>
          )}
          {type == "File" && onClickStar && isFileStared !== undefined && (
            <div>
              <p
                onClick={() => onClickStar(id, !isFileStared)}
                className="cursor-pointer flex gap-1 items-center hover:bg-slate-200 p-2 pl-4 text-sm rounded-md"
              >
                <Star
                  className={cn(
                    isFileStared && "fill-[#e1ad21] ",
                    "h-4 w-4 text-slate-600"
                  )}
                  color={isFileStared ? "#e1ad21" : "#475569"}
                />
                Star
              </p>
            </div>
          )}
          {type == "Folder" && onClickEdit && (
            <div>
              <p
                onClick={() => onClickEdit(id)}
                className="cursor-pointer flex gap-1 items-center hover:bg-slate-200 p-2 pl-4 text-sm rounded-md"
              >
                <Pencil className="h-4 w-4 text-slate-600" />
                Edit
              </p>
            </div>
          )}
          <div>
            <p
              onClick={() => onOpen("delete", { id, name, deleteType: type })}
              className="cursor-pointer flex gap-1 items-center hover:bg-slate-200 p-2 pl-4 text-sm rounded-md"
            >
              <Trash className="h-4 w-4 text-slate-600" />
              Delete
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Options;
