"use client";

import { Check, Copy, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/store/use-modal-store";
import { useDataStore } from "@/store/use-data-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

export const ShareFileModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const { refetchFilesFolder, toggleFetchingData } = useDataStore();
  const origin = window.location.origin || "";
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!data) return;
  const { fileInviteCode, id } = data;

  const inviteUrl = `${origin}/file/share/${fileInviteCode}`;

  const isModalOpen = isOpen && type === "share";

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      toggleFetchingData(true);
      const res = await axios.patch(`/api/file/invite-code`, { fileId: id });

      onOpen("share", { fileInviteCode: res.data.inviteCode, id });
      refetchFilesFolder(new Date());
    } catch (e) {
      console.log(e);
    } finally {
      toggleFetchingData(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8">
          <DialogTitle className="text-2xl text-center font-bold">
            Share file
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            File link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />

            <Button
              disabled={isLoading}
              variant="outline"
              onClick={onCopy}
              size="icon"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <Button
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
            onClick={onNew}
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
