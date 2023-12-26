"use client";

import { Check, Copy, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/store/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const ShareFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const origin = window.location.origin || "";
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!data) return;
  const { fileInviteCode } = data;

  const inviteUrl = `${origin}/file/share/${fileInviteCode}`;

  const isModalOpen = isOpen && type === "share";

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8">
          <DialogTitle className="text-2xl text-center font-bold">
            Share file
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pb-8">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
