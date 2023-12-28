"use client";

import { useEffect, useState } from "react";
import qs from "query-string";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import File from "@/components/File";
import axios from "axios";
import Image from "next/image";
import moment from "moment";
import { ScaleLoader } from "react-spinners";

interface Props {
  fileId: number;
}

interface DrawerData {
  name: string;
  uploadedURL: string;
  fileOwner: string;
  fileOwnerImage: string;
  createdAt: string;
}

const SideDrawer: React.FC<Props> = ({ fileId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData>({
    name: "",
    uploadedURL: "",
    fileOwner: "",
    fileOwnerImage: "",
    createdAt: "",
  });

  const date = moment(drawerData.createdAt).format("DD-MM-YYYY, h:mm a");

  useEffect(() => {
    const getFileDetails = async () => {
      const url = qs.stringifyUrl({
        url: "/api/file/detail",
        query: { fileId },
      });
      const res = await axios.get(url);

      setDrawerData(res.data);
      setIsLoading(false);
    };

    if (isLoading) {
      getFileDetails();
    }
  }, [fileId, isLoading]);

  return (
    <Sheet>
      <SheetTrigger
        onClick={() => setIsLoading(true)}
        className="cursor-pointer w-full flex gap-1 items-center hover:bg-slate-200 p-2 pl-4 text-sm rounded-md"
      >
        <Info className="h-4 w-4 text-slate-600" />
        Info
      </SheetTrigger>
      <SheetContent>
        {!isLoading ? (
          <SheetHeader>
            <SheetTitle className="w-full font-bold text-xl text-slate-600/80 mb-5">
              File details
            </SheetTitle>
            <SheetDescription className="">
              <div className="flex flex-col justify-center items-center gap-2">
                <File
                  name={drawerData.name}
                  layout="grid"
                  hideOptions
                  url={drawerData.uploadedURL}
                />
                <p className="p-2">{drawerData.name}</p>
              </div>

              <div>
                <h1 className="text-slate-600 font-bold">Owner</h1>
                <div className="flex justify-between items-center gap-2 p-2">
                  <div className="flex justify-start items-center gap-2">
                    <Image
                      className="h-6 w-6 rounded-full"
                      src={drawerData.fileOwnerImage}
                      alt=""
                      height={1920}
                      width={1080}
                    />
                    <p>{drawerData.fileOwner}</p>
                  </div>

                  <p>{date}</p>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        ) : (
          <p className="h-full w-full justify-center items-center flex">
            <ScaleLoader color="#9ec3f9" height={20} />
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SideDrawer;
