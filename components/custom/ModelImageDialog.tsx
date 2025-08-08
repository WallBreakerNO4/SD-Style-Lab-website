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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModelImageDialogProps {
  imageUrl: string;
  altText: string;
  children: React.ReactNode;
  imageInfo?: string;
}

export function ModelImageDialog({ imageUrl, altText, children, imageInfo }: ModelImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // 当 Dialog 关闭时，重置信息面板状态
  useEffect(() => {
    if (!isOpen) {
      setShowInfoPanel(false);
    }
  }, [isOpen]);

  // 移除 createPortal 的 InfoPanel，改用 Sheet 实现

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          showCloseButton={false}
          unpadded={true}
          className="w-auto h-auto max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4"
          style={{
            marginRight: showInfoPanel ? '384px' : '0', // 为信息面板留出空间
          }}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{altText}</DialogTitle>
            <DialogDescription>
              A larger view of the sample image.
            </DialogDescription>
          </DialogHeader>
          <div className="relative flex items-center justify-center w-full h-full">
            <Image
              src={imageUrl}
              alt={altText}
              width={1920}
              height={1080}
              className="object-contain w-auto h-auto max-w-full max-h-full"
              unoptimized
            />
            {imageInfo && (
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowInfoPanel(true)}
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                title="查看信息"
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogContent>

        {/* 右侧信息面板 - 与 DialogContent 平级 */}
        {imageInfo && (
          <Sheet open={showInfoPanel} onOpenChange={setShowInfoPanel}>
            <SheetContent side="right" className="w-96 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>图片信息</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-4rem)] p-4">
                <pre className="text-xs whitespace-pre-wrap break-words font-mono text-foreground/90 bg-muted/30 rounded p-3">
                  {imageInfo}
                </pre>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}
      </Dialog>
    </>
  );
}