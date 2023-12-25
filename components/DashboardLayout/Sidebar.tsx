"use client";

import { loadStripe } from "@stripe/stripe-js";
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
import {
  Clock4,
  Crown,
  HardDrive,
  Plus,
  Star,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/use-modal-store";
import { upload_to_bucket } from "@/lib/supabaseOperations";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";
import { useSupabase } from "@/store/use-supabase-store";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const stripKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const asyncStripe = loadStripe(stripKey);

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
  const { onOpen } = useModal();
  const { startTopLoader, stopTopLoader } = useLoaderStore();
  const { refetchFilesFolder, toggleFetchingData, userAccountInfo } =
    useDataStore();
  const { supabase } = useSupabase();
  const {
    tier,
    filesUploaded,
    foldersCreated,
    totalFilesLimit,
    totalFoldersLimit,
  } = userAccountInfo;
  const [fileUploadedProgress, setFileUploadedProgress] = useState(0);
  const [folderCreatedProgress, setFolderCreatedProgress] = useState(0);

  useEffect(() => {
    setFileUploadedProgress(
      filesUploaded * 20 > 100 ? 100 : filesUploaded * 20
    );
    setFolderCreatedProgress(
      foldersCreated * 20 > 100 ? 100 : foldersCreated * 20
    );
  }, [filesUploaded, foldersCreated, userAccountInfo]);

  useEffect(() => {
    const isFolderRoute = pathName.includes("/folder/");
    const uploadToDB = async (filePath: string) => {
      let folderId = "";
      if (isFolderRoute) {
        folderId = pathName?.split("/")?.pop() || "";
      }
      try {
        await axios.post("/api/file/upload", {
          filePath,
          isFolderRoute,
          folderId,
        });
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
                  toggleFetchingData(true);
                  refetchFilesFolder(new Date());
                }
                reject("failed");
              });
            })
            .catch((error) => {
              reject(error);
            });
        }).finally(() => {
          setSelectedFile(null);
          toggleFetchingData(false);
          stopTopLoader();
        });

      if (filesUploaded >= totalFilesLimit) {
        toast.error(
          "Free tier allows 5 file to be uploaded! Upgrade to premium or delete existing files."
        );
        setSelectedFile(null);
        return;
      }

      startTopLoader();
      toast.promise(promise(), {
        loading: "Uploading...",
        success: "File uploaded successfully!",
        error: "Error uploading file.",
      });
    }
  }, [
    filesUploaded,
    pathName,
    refetchFilesFolder,
    selectedFile,
    startTopLoader,
    stopTopLoader,
    supabase,
    toggleFetchingData,
    totalFilesLimit,
  ]);

  const changeActiveTab = (id: number) => {
    setActiveTab(id);
  };

  const stripHandler = async () => {
    try {
      const stripe = await asyncStripe;
      if (!stripe) return;
      const res = await axios.post("/api/stripe/session", {
        amount: "2000",
      });

      const { sessionId } = res.data;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        toast.error("Error redirecting to checkout");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-[20%] 2xl:w-[10%] bg-[#F7F9FC] hidden lg:flex flex-col p-2 lg:p-2 xl:p-4">
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

      <Separator className="mt-4" />

      {/* Account info */}
      <div className="flex flex-col p-4 space-y-4">
        <h2
          className={cn(
            "flex justify-center items-center gap-2 text-sm p-2 font-bold rounded-xl",
            tier == "FREE"
              ? " text-white bg-blue-200"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          )}
        >
          {tier == "FREE" ? (
            <User className="h-4 w-4" />
          ) : (
            <Crown className="h-4 w-4" />
          )}
          <p>{tier} PLAN</p>
        </h2>
        <div className="flex flex-col">
          <p className="text-xs">
            {tier !== "FREE"
              ? "Unlimited file uploads"
              : `${filesUploaded} / ${totalFilesLimit} files uploaded`}
          </p>
          <div className="w-full">
            <Progress value={fileUploadedProgress} className="w-full h-2" />
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-xs">
            {tier !== "FREE"
              ? "Unlimited folder creation"
              : `${foldersCreated} / ${totalFoldersLimit} folders created`}
          </p>
          <div className="w-full">
            <Progress value={folderCreatedProgress} className="w-full h-2" />
          </div>
        </div>

        {tier == "FREE" && (
          <Button
            onClick={() => stripHandler()}
            className="hover:bg-blue-500 gap-2 hover:text-white focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md py-2 px-4"
            variant={"outline"}
          >
            <Crown className="h-4 w-4" />
            Premium
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
