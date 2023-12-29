"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState, useRef, useEffect, Fragment } from "react";
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
import { useRouter } from "next/navigation";

const stripKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const asyncStripe = loadStripe(stripKey);

const tabs = [
  {
    id: 1,
    label: "My Drive",
    icon: <HardDrive className="w-5 h-5 text-slate-800" />,
    tooltip: "my drive",
    url: "/dashboard/home",
  },
  {
    id: 2,
    label: "Shared with me",
    icon: <Users className="w-5 h-5 text-slate-800" />,
    tooltip: "items shared with me",
    url: "/dashboard/shared",
  },
  {
    id: 3,
    label: "Recents",
    icon: <Clock4 className="w-5 h-5 text-slate-800" />,
    tooltip: "recents",
    url: "/dashboard/recents",
  },
  {
    id: 4,
    label: "Stared",
    icon: <Star className="w-5 h-5 text-slate-800" />,
    tooltip: "stared items",
    url: "/dashboard/stared",
  },
];

const Sidebar = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<null | FileList>(null);
  const pathName = usePathname();
  const { onOpen } = useModal();
  const { startTopLoader, stopTopLoader } = useLoaderStore();
  const { files, addDataToStore, userAccountInfo } = useDataStore();
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
    if (activeTab == 0) {
      const currentURL = pathName.split("/")?.[pathName.split("/")?.length - 1];
      switch (currentURL) {
        case "home":
          setActiveTab(1);
          break;
        case "shared":
          setActiveTab(2);
          break;
        case "recents":
          setActiveTab(3);
          break;
        case "stared":
          setActiveTab(4);
          break;
        default:
      }
    }
  }, [activeTab, pathName]);

  useEffect(() => {
    setFileUploadedProgress(
      userAccountInfo.tier !== "FREE"
        ? 100
        : filesUploaded * 20 > 100
        ? 100
        : filesUploaded * 20
    );
    setFolderCreatedProgress(
      userAccountInfo.tier !== "FREE"
        ? 100
        : foldersCreated * 20 > 100
        ? 100
        : foldersCreated * 20
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
        const res = await axios.post("/api/file/upload", {
          filePath,
          isFolderRoute,
          folderId,
        });

        setSelectedFile(null);
        const { file } = res.data;

        const updatedFiles = [...files];
        updatedFiles.push(file);

        addDataToStore(updatedFiles);

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
          upload_to_bucket(selectedFile[0], supabase, userAccountInfo.email)
            .then((response: any) => {
              const filePath = response.fullPath;
              uploadToDB(filePath).then((response) => {
                if (response == "done") {
                  resolve(response);
                }
                reject("failed");
              });
            })
            .catch((error) => {
              reject(error);
            });
        }).finally(() => {
          setSelectedFile(null);
          stopTopLoader();
        });

      if (tier == "FREE" && filesUploaded >= totalFilesLimit) {
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
    addDataToStore,
    files,
    filesUploaded,
    pathName,
    selectedFile,
    startTopLoader,
    stopTopLoader,
    supabase,
    tier,
    totalFilesLimit,
    userAccountInfo.email,
  ]);

  const changeActiveTab = (id: number) => {
    setActiveTab(id);
    router.push(tabs[id - 1].url);
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
    <Fragment>
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

        <PopoverContent className="w-[180%]" side="bottom">
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
    </Fragment>
  );
};

export default Sidebar;
