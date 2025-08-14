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

interface ParsedImageInfo {
  prompt?: string;
  negative_prompt?: string;
  steps?: number;
  cfg_scale?: number;
  seed?: number;
  width?: number;
  height?: number;
  sampler_name?: string;
  sd_model_name?: string;
  sd_model_hash?: string;
  version?: string;
  [key: string]: unknown;
}

interface ModelImageDialogProps {
  imageUrl: string;
  altText: string;
  children: React.ReactNode;
  imageInfo?: string;
}

const parseImageInfo = (infoStr: string): ParsedImageInfo | null => {
  try {
    return JSON.parse(infoStr) as ParsedImageInfo;
  } catch (error) {
    console.error('Failed to parse image info:', error);
    return null;
  }
};

const formatInfoValue = (key: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
};

const getDisplayLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    prompt: "正向提示词",
    negative_prompt: "负向提示词",
    steps: "步数",
    cfg_scale: "CFG 缩放",
    seed: "种子",
    width: "宽度",
    height: "高度",
    sampler_name: "采样器",
    sd_model_name: "模型名称",
    sd_model_hash: "模型哈希",
    version: "版本",
    batch_size: "批量大小",
    restore_faces: "面部修复",
    denoising_strength: "降噪强度"
  };

  return labelMap[key] || key;
};

export function ModelImageDialog({ imageUrl, altText, children, imageInfo }: ModelImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [parsedInfo, setParsedInfo] = useState<ParsedImageInfo | null>(null);

  // 当 Dialog 关闭时，重置信息面板状态
  useEffect(() => {
    if (!isOpen) {
      setShowInfoPanel(false);
    }
  }, [isOpen]);

  // 解析图片信息
  useEffect(() => {
    if (imageInfo) {
      const parsed = parseImageInfo(imageInfo);
      setParsedInfo(parsed);
    } else {
      setParsedInfo(null);
    }
  }, [imageInfo]);

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
                {parsedInfo ? (
                  <div className="space-y-4">
                    {/* 重要参数优先显示 */}
                    {['prompt', 'negative_prompt', 'steps', 'cfg_scale', 'seed', 'width', 'height', 'sampler_name', 'sd_model_name'].map((key) => {
                      const value = parsedInfo[key];
                      if (value === undefined || value === null || value === "") return null;

                      return (
                        <div key={key} className="space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            {getDisplayLabel(key)}
                          </div>
                          <div className="text-sm text-muted-foreground bg-muted/30 rounded p-2">
                            {key === 'prompt' || key === 'negative_prompt' ? (
                              <div className="whitespace-pre-wrap break-words">
                                {formatInfoValue(key, value)}
                              </div>
                            ) : (
                              <div className="font-mono">
                                {formatInfoValue(key, value)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* 其他参数 */}
                    <details className="mt-6">
                      <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-foreground/80">
                        更多参数
                      </summary>
                      <div className="mt-2 space-y-2">
                        {Object.entries(parsedInfo).map(([key, value]) => {
                          // 跳过已经显示的重要参数
                          if (['prompt', 'negative_prompt', 'steps', 'cfg_scale', 'seed', 'width', 'height', 'sampler_name', 'sd_model_name'].includes(key)) {
                            return null;
                          }

                          if (value === undefined || value === null || value === "") return null;

                          return (
                            <div key={key} className="flex justify-between items-start text-xs">
                              <span className="text-muted-foreground font-medium min-w-0 flex-shrink-0 mr-2">
                                {getDisplayLabel(key)}:
                              </span>
                              <span className="text-right font-mono text-foreground/90 break-words">
                                {formatInfoValue(key, value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    无法解析图片信息
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}
      </Dialog>
    </>
  );
}