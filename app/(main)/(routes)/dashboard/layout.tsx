"use client";

import { isEmpty } from "lodash";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/DashboardLayout/Navbar";
import { Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useSupabase } from "@/store/use-supabase-store";
import { useDataStore } from "@/store/use-data-store";
import { useLayout } from "@/store/use-layout-store";
import { usePathname } from "next/navigation";
import SidebarWrapper from "@/components/DashboardLayout/SidebarWrapper";
import axios from "axios";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { layout, onChangeLayout } = useLayout();
  const { breadCrumbData, isFetchingData, files, folders, addDataToStore } =
    useDataStore();
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
  const { createSupabaseClient, supabase } = useSupabase();
  const pathName = usePathname();

  const getHeading = () => {
    if (pathName.includes("/home")) {
      return "My Drive";
    } else if (pathName.includes("/shared")) {
      return "Shared with me";
    } else if (pathName.includes("/shared")) {
      return "Recents";
    }

    return "Stared";
  };

  useEffect(() => {
    const getUserAccountInfo = async () => {
      try {
        const res = await axios.get("/api/get-user-account-info");
        addDataToStore(undefined, undefined, res.data.userAccountInfo);
      } catch (err) {
        console.log(err);
      }
    };
    getUserAccountInfo();
  }, [addDataToStore, files, folders]);

  useEffect(() => {
    if (!supabase) {
      createSupabaseClient(supabaseURL, supabaseKEY);
    }
  }, [createSupabaseClient, supabase, supabaseKEY, supabaseURL]);

  return (
    <div className="h-screen overflow-hidden">
      {/* navbar */}
      <Navbar />

      <div className="w-full h-full">
        <div className="flex w-full h-full">
          <SidebarWrapper isMenu={false} />
          <ScrollArea className="w-full !static">
            {!isFetchingData && (
              <div className="flex justify-between p-6">
                {isEmpty(breadCrumbData) ? (
                  <h1 className="text-2xl">{getHeading()}</h1>
                ) : (
                  <Breadcrumb breadcrumb={breadCrumbData} />
                )}
                <div className="flex w-[80px] overflow-hidden justify-between rounded-xl border border-black cursor-pointer">
                  <div
                    onClick={() => onChangeLayout("list")}
                    className={`${cn(
                      layout == "list" && "bg-[#BFDBFE]",
                      "w-[50%] p-1 flex justify-center items-center"
                    )}`}
                  >
                    <List className="h-5 w-5" />
                  </div>
                  <div className="border border-black"></div>
                  <div
                    onClick={() => onChangeLayout("grid")}
                    className={`${cn(
                      layout == "grid" && "bg-[#BFDBFE]",
                      "w-[50%] p-1 flex justify-center items-center"
                    )}`}
                  >
                    <Grid className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )}
            {children}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
