"use client";

import qs from "query-string";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import axios from "axios";
import { useState } from "react";
import { useModal } from "@/store/use-modal-store";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/store/use-data-store";
import { useLoaderStore } from "@/store/use-loader-store";
import { useSupabase } from "@/store/use-supabase-store";
import { delete_from_bucket } from "@/lib/supabaseOperations";

export const DeleteModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { refetchFilesFolder } = useDataStore();
  const { startTopLoader, stopTopLoader } = useLoaderStore();
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useSupabase();

  if (!data) return;
  const { name, deleteType, id } = data;

  const isModalOpen = isOpen && type === "delete";

  const deleteContent = async () => {
    try {
      startTopLoader();
      const query = {
        name: name.toString(),
        deleteType: deleteType.toString(),
        id: id.toString(),
      };

      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: "/api/delete",
        query,
      });

      await axios.delete(url);
      toast.success(`${deleteType} deleted successfully`);
      refetchFilesFolder(new Date());
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      stopTopLoader();
    }
  };

  const deleteFromDB = async () => {
    try {
      const query = {
        name: name.toString(),
        deleteType: deleteType.toString(),
        id: id.toString(),
      };

      const url = qs.stringifyUrl({
        url: "/api/delete",
        query,
      });

      await axios.delete(url);
      return new Promise((resolve) => {
        resolve("done");
      });
    } catch (e) {
      return new Promise((resolve) => {
        resolve("failed");
      });
    }
  };

  const deleteFile = () => {
    if (!supabase) return;
    startTopLoader();
    const promise = () =>
      new Promise((resolve, reject) => {
        delete_from_bucket(name, supabase)
          .then(() => {
            deleteFromDB().then((response) => {
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
        refetchFilesFolder(new Date());
        onClose();
      });
    toast.promise(promise(), {
      loading: "Deleting...",
      success: "File deleted successfully!",
      error: "Error deleting file.",
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete {deleteType}
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            {deleteType == "Folder" &&
              `Files and folder associated with ${name} will be deleted.`}{" "}
            Are you sure you want to delete this {deleteType.toLowerCase()}:{" "}
            <span className="font-bold">{name}</span>?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={() => onClose()}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() =>
                deleteType == "Folder" ? deleteContent() : deleteFile()
              }
              variant="danger"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
