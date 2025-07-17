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

interface ModelImageDialogProps {
  imageUrl: string;
  altText: string;
  children: React.ReactNode;
  imageInfo?: string;
}

export function ImageDialog({ imageUrl, altText, children, imageInfo }: ModelImageDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        unpadded={true}
        className="w-auto h-auto max-w-[90vw] max-h-[90vh] flex flex-col items-center justify-center p-4"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{altText}</DialogTitle>
          <DialogDescription>
            A larger view of the sample image.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-auto h-auto max-w-full max-h-[70vh] mb-4">
          <Image
            src={imageUrl}
            alt={altText}
            width={1920}
            height={1080}
            className="object-contain w-auto h-auto max-w-full max-h-full"
            unoptimized
          />
        </div>
        {imageInfo && (
          <div className="w-full max-w-4xl max-h-[20vh] overflow-y-auto">
            <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg">
              <h3 className="text-sm font-semibold mb-2 text-foreground">图片信息</h3>
              <pre className="text-xs whitespace-pre-wrap break-words font-mono text-foreground/90 bg-muted/30 rounded p-3">
                {imageInfo}
              </pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}