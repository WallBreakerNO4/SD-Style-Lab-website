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
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModelImageDialogProps {
  imageUrl: string;
  altText: string;
  children: React.ReactNode;
  imageInfo?: string;
}

export function ImageDialog({ imageUrl, altText, children, imageInfo }: ModelImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // 当 Dialog 打开时，如果有图片信息则显示信息面板
  useEffect(() => {
    if (isOpen && imageInfo) {
      setShowInfoPanel(true);
    } else {
      setShowInfoPanel(false);
    }
  }, [isOpen, imageInfo]);

  const InfoPanel = () => {
    if (!showInfoPanel || typeof window === 'undefined') return null;

    return createPortal(
      <div className="fixed top-0 right-0 h-full w-96 bg-background/95 backdrop-blur-sm border-l border-border/50 shadow-2xl z-[60] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="text-lg font-semibold text-foreground">图片信息</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInfoPanel(false)}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <pre className="text-xs whitespace-pre-wrap break-words font-mono text-foreground/90 bg-muted/30 rounded p-3">
            {imageInfo}
          </pre>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          showCloseButton={false}
          unpadded={true}
          className="w-auto h-auto max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4"
          style={{
            marginRight: showInfoPanel ? '192px' : '0', // 为信息面板留出空间 (384px / 2 = 192px)
          }}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{altText}</DialogTitle>
            <DialogDescription>
              A larger view of the sample image.
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-auto h-auto max-w-full max-h-[85vh]">
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
                size="sm"
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                {showInfoPanel ? '隐藏信息' : '显示信息'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <InfoPanel />
    </>
  );
}