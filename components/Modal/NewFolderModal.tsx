import React, { useState } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/store/use-modal-store";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, { message: "Folder name is required" }),
});

const NewFolderModal = () => {
  const { isOpen, onClose, type } = useModal();
  const pathName = usePathname();
  const { startTopLoader, stopTopLoader } = useLoaderStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "newFolder";
  const { refetchFilesFolder } = useDataStore();
  const onSubmit = async (value: { name: string }) => {
    const isFolderRoute = pathName.includes("/folder/");
    try {
      startTopLoader();
      setIsLoading(true);
      const folderName = value.name;
      let parentId = undefined;

      if (isFolderRoute) {
        const paths = pathName.split("/");
        parentId = paths?.[paths.length - 1];
      }

      const res = await axios.post("/api/folder/create", {
        folderName,
        parentId,
      });

      if (res.status == 200) {
        toast.success(`Folder created: ${value.name}`);
        refetchFilesFolder(new Date());
        form.reset();
        onClose();
      } else {
        toast.error("Error while creating folder!");
      }
    } catch (err) {
      console.log(err);
    } finally {
      stopTopLoader();
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            New folder
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Folder name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={false}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter folder name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormMessage />

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="default">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFolderModal;
