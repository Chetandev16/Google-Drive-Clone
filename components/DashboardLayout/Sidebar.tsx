"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock4, HardDrive, Plus, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/use-modal-store";
import { upload_to_bucket } from "@/lib/supabaseOperations";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";
import { useSupabase } from "@/store/use-supabase-store";

const tabs = [
  {
    id: 1,
    label: "My Drive",
    icon: <HardDrive className="w-5 h-5 text-slate-800" />,
    tooltip: "my drive",
  },
  {
    id: 2,
    label: "Shared with me",
    icon: <Users className="w-5 h-5 text-slate-800" />,
    tooltip: "items shared with me",
  },
  {
    id: 3,
    label: "Recents",
    icon: <Clock4 className="w-5 h-5 text-slate-800" />,
    tooltip: "recents",
  },
  {
    id: 4,
    label: "Stared",
    icon: <Star className="w-5 h-5 text-slate-800" />,
    tooltip: "stared items",
  },
];

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<null | FileList>(null);
  const pathName = usePathname();
  const isFolderRoute = pathName.includes("/folder/");
  const { onOpen } = useModal();
  const { startTopLoader, stopTopLoader } = useLoaderStore();
  const { refetchFilesFolder } = useDataStore();
  const { supabase } = useSupabase();

  useEffect(() => {
    const uploadToDB = async (filePath: string) => {
      try {
        await axios.post("/api/file/upload", { filePath, isFolderRoute });
        return new Promise((resolve) => {
          resolve("done");
        });
      } catch (e) {
        return new Promise((resolve) => {
          resolve("failed");
        });
      }
    };

    if (selectedFile && supabase) {
      const promise = () =>
        new Promise((resolve, reject) => {
          upload_to_bucket(selectedFile[0], supabase)
            .then((response: any) => {
              const filePath = response.fullPath;
              uploadToDB(filePath).then((response) => {
                if (response == "done") {
                  resolve(response);
                  refetchFilesFolder(new Date());
                }
                reject("failed");
              });
            })
            .catch((error) => {
              reject(error);
            });
        }).finally(() => {
          stopTopLoader();
        });

      startTopLoader();
      toast.promise(promise(), {
        loading: "Uploading...",
        success: "File uploaded successfully!",
        error: "Error uploading file.",
      });
    }
  }, [
    isFolderRoute,
    refetchFilesFolder,
    selectedFile,
    startTopLoader,
    stopTopLoader,
    supabase,
  ]);

  const changeActiveTab = (id: number) => {
    setActiveTab(id);
  };

  return (
    <div className="w-[20%] 2xl:w-[10%] bg-[#F7F9FC] hidden sm:flex flex-col p-2 lg:p-2 xl:p-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[70%] lg:w-[50%] flex justify-start gap-2 rounded-2xl shadow-xl"
          >
            <Plus className="w-5 h-5 text-slate-800" />
            <p>New</p>
          </Button>
        </PopoverTrigger>

        <PopoverContent side="right">
          <div>
            <div>
              <p
                onClick={() => inputRef.current && inputRef.current.click()}
                className="cursor-pointer hover:bg-slate-200 p-2 pl-4 text-sm rounded-md"
              >
                File Upload
              </p>
              <input
                onChange={(e) => {
                  setSelectedFile(e.target.files);
                }}
                ref={inputRef}
                type="file"
                className="hidden"
              />
            </div>
            <div>
              <p
                onClick={() => onOpen("newFolder")}
                className="cursor-pointer hover:bg-slate-200 p-2 pl-4 text-sm rounded-md"
              >
                New Folder
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="mt-5 flex flex-col gap-3">
        {tabs.map((tab) => (
          <TooltipProvider key={tab.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => changeActiveTab(tab.id)}
                  className={cn(
                    "flex text-sm gap-2 p-3 rounded-xl",
                    activeTab == tab.id
                      ? "bg-blue-200"
                      : "cursor-pointer hover:bg-slate-200"
                  )}
                >
                  {tab.icon}

                  <p>{tab.label}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={2}
                className="bg-slate-700 text-white"
              >
                <p>{tab.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
