"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

interface ImageDialogProps {
  imageUrl: string;
  altText: string;
  children: React.ReactNode;
}

export function ImageDialog({ imageUrl, altText, children }: ImageDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        unpadded={true}
        className="w-auto h-auto max-w-[90vw] max-h-[90vh] flex items-center justify-center"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{altText}</DialogTitle>
          <DialogDescription>
            A larger view of the sample image.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-auto h-auto max-w-full max-h-full">
          <Image
            src={imageUrl}
            alt={altText}
            width={1920}
            height={1080}
            className="object-contain w-auto h-auto max-w-full max-h-[85vh]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}