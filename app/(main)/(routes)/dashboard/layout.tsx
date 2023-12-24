"use client";

import Navbar from "@/components/DashboardLayout/Navbar";
import Sidebar from "@/components/DashboardLayout/Sidebar";
import { Grid, List } from "lucide-react";
import { useLayout } from "@/store/use-layout-store";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useSupabase } from "@/store/use-supabase-store";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { layout, onChangeLayout } = useLayout();
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
  const { createSupabaseClient, supabase } = useSupabase();

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
          <Sidebar />
          <ScrollArea className="w-full">
            <div className="flex justify-between p-6">
              <h1 className="text-2xl">My Drive</h1>
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
            {children}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
