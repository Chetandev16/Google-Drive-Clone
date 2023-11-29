"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

import logo from "@/assets/logo.svg";
import mainImage from "@/assets/mainpage.jpg";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LandingPage = () => {
  const { setTheme } = useTheme();
  const { push } = useRouter();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <div className="h-screen">
      {/* Navbar */}
      <div className="flex p-3  h-[10%]">
        <div className="flex h-fit justify-between w-full">
          {" "}
          <div className="flex justify-center items-center gap-1">
            <Image src={logo} alt="logo" height={40} width={40} />
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800/90 dark:text-white">
              Google
            </h2>
            <h4 className="text-lg sm:text-xl dark:text-white/50">Drive</h4>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => push("/login")}
              className="hidden sm:block"
              variant="outline"
            >
              Sign in
            </Button>
            <Button onClick={() => push("/dashboard")}>Go to Drive</Button>
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="h-[80%] flex  justify-center items-center">
        <div className="flex  h-full justify-center items-center gap-12 flex-col lg:flex-row w-full lg:w-[80%]">
          <div className="w-[90%] lg:w-[30%] flex justify-center items-start flex-col gap-3 lg:gap-7 2xl:gap-12">
            <h1 className="text-2xl lg:text-3xl 2xl:text-5xl">
              Easy and secure access to your content
            </h1>
            <h3 className="text-lg lg:text-xl 2xl:text-2xl text-slate-600/90">
              Store, share, and collaborate on files and folders from your
              mobile device, tablet, or computer
            </h3>

            <Button
              onClick={() => push("/dashboard")}
              className="w-full lg:w-[140px] 2xl:w-[192px] h-[40px] lg:h-[50px] text-md 2xl:text-lg"
            >
              Go to Drive
            </Button>

            <div className="flex justify-center items-center gap-4">
              <p className="text-md text-slate-600/80">
                Don`t have an account?{" "}
              </p>
              <Button
                className="w-[140px] 2xl:w-[167px] h-[50] text-[#1a73e8]"
                variant="outline"
                onClick={() => push("/signup")}
              >
                Sign up at no cost
              </Button>
            </div>
          </div>

          <Image
            src={mainImage}
            className="h-[700px] w-[600px] 2xl:w-[700px] object-contain "
            alt="main image"
          />
        </div>
      </div>

      {/* footer */}
      <div className="h-[10%] flex justify-center items-center flex-col">
        <p className="font-semibold">Built by chetan ❤️</p>
        <p className="text-xs">
          ©Google Drive Clone - Built for Educational Purposes
        </p>
      </div>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
};
export default LandingPage;
