"use client";

import { useEffect, useRef, Fragment } from "react";
import LoadingBar from "react-top-loading-bar";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { UserButton } from "@clerk/nextjs";

import { Input } from "@/components/ui/input";
import { Menu, Search } from "lucide-react";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarWrapper from "@/components/DashboardLayout/SidebarWrapper";

type LoadingBarType = any;

const Navbar = () => {
  const ref = useRef<LoadingBarType>(null);
  const { setLoaderRef } = useLoaderStore();
  const { setSearchKeyword } = useDataStore();

  useEffect(() => {
    if (ref.current) {
      setLoaderRef(ref.current);
    }
  }, [setLoaderRef]);

  return (
    <Fragment>
      <LoadingBar color="#ff7c05" ref={ref} />
      <div className="w-full bg-[#F7F9FC] p-4 flex justify-between items-center">
        <div className="flex justify-start items-center gap-2">
          <Sheet>
            <SheetTrigger>
              <Menu className="text-slate-600/80 lg:hidden" />
            </SheetTrigger>

            <SheetContent side={"left"}>
              <SidebarWrapper isMenu />
            </SheetContent>
          </Sheet>
          <Image src={logo} alt="logo" className="h-6 sm:h-9 w-6 sm:w-9" />
          <h1 className="hidden sm:block text-lg sm:text-xl font-semibold text-slate-700/80">
            Drive
          </h1>
        </div>

        {/* serch */}
        <div className="relative w-[60%] sm:w-[50%] lg:w-[40%]">
          <Search className="h-5 w-5 absolute top-[0.65rem] left-3 text-slate-500" />
          <Input
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="bg-[#EDF2FC] rounded-3xl pl-10 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            type="text"
            placeholder="Search"
          />
        </div>
        {/* User */}

        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[40px] w-[40px]",
            },
          }}
          afterSignOutUrl="/"
        />
      </div>
    </Fragment>
  );
};

export default Navbar;
