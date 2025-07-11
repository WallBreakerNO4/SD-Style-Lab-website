"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { VirtuosoGrid, VirtuosoGridHandle } from "react-virtuoso";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ImageDialog } from "@/components/ImageDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ImageData {
  index: number;
  image_url: string;
  parameters: Record<string, unknown>;
  info: string;
}

interface ModelInfo {
  title: string;
  description: {
    en_US: string;
    zh_CN: string;
  };
}

export interface ModelData {
  modelInfo: ModelInfo;
  imageData: ImageData[];
  tableHeaders: string[];
  tableRows: string[][];
}

interface ModelClientPageProps {
  modelData: ModelData;
}

export function ModelClientPage({ modelData }: ModelClientPageProps) {
  const { modelInfo, imageData, tableHeaders, tableRows } = modelData;
  const isMobile = useIsMobile();
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      if (!scrolled) {
        setIsManuallyExpanded(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const getImageDataByIndex = (indexStr: string): ImageData | undefined => {
    const index = parseInt(indexStr, 10);
    return imageData.find((img) => img.index === index);
  };

  const renderImageCell = (image: ImageData | undefined) => {
    if (!image) {
      return <div className="w-full aspect-[13/19] bg-gray-200 rounded-md" />;
    }
    return (
      <ImageDialog imageUrl={image.image_url} altText={`Image ${image.index}`}>
        <div className="relative w-full aspect-[13/19] cursor-pointer">
          <Image
            src={image.image_url}
            alt={`Image ${image.index}`}
            fill
            className="object-cover rounded-md"
            unoptimized
          />
        </div>
      </ImageDialog>
    );
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-background pb-4 sticky top-0 z-10">
        <div className="mb-2 flex justify-between items-start">
          <h1 className="text-3xl font-bold">{modelInfo.title}</h1>
          {isScrolled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsManuallyExpanded(!isManuallyExpanded)}
              className="flex items-center"
            >
              {isManuallyExpanded ? "收起" : "展开"}
              {isManuallyExpanded ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            !isScrolled || isManuallyExpanded
              ? "max-h-48 opacity-100"
              : "max-h-0 opacity-0"
          )}
        >
          <p className="text-muted-foreground">
            {modelInfo.description.zh_CN}
          </p>
        </div>
        {!isMobile && (
          <div className="grid grid-cols-6 gap-4 font-bold pt-4 mt-4 border-t border-border">
            {tableHeaders.map((header, index) => (
              <div key={index} className="text-center">
                {header}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2">
        {isMobile ? (
          <div className="space-y-4">
            {tableRows.map((row, rowIndex) => (
              <Card
                key={rowIndex}
                className={cn({ "bg-muted": rowIndex % 2 !== 0 })}
              >
                <CardHeader>
                  <CardTitle>{row[0]}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {row.slice(1).map((cell, cellIndex) => (
                    <div key={cellIndex}>
                      {renderImageCell(getImageDataByIndex(cell))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <div>
              <VirtuosoGrid
                ref={virtuosoRef}
                useWindowScroll
                totalCount={tableRows.length * tableHeaders.length}
                overscan={1500}
                components={{
                  List: React.forwardRef<
                    HTMLDivElement,
                    { style?: React.CSSProperties; children?: React.ReactNode }
                  >(function List({ style, children }, ref) {
                    return (
                      <div
                        ref={ref}
                        style={style}
                        className="grid grid-cols-6"
                      >
                        {children}
                      </div>
                    );
                  }),
                  Item: (props) => <div {...props} />,
                }}
                itemContent={(index) => {
                  const numCols = tableHeaders.length || 6;
                  const rowIndex = Math.floor(index / numCols);
                  const colIndex = index % numCols;
                  const row = tableRows[rowIndex];

                  if (!row) return null;

                  const cell = row[colIndex];
                  const rowBg =
                    rowIndex % 2 !== 0 ? "bg-muted" : "bg-transparent";

                  if (colIndex === 0) {
                    return (
                      <div
                        className={cn(
                          "flex items-center justify-center p-2 h-full",
                          rowBg
                        )}
                      >
                        <Badge
                          variant="outline"
                          className="whitespace-normal text-center text-sm font-semibold"
                        >
                          {cell}
                        </Badge>
                      </div>
                    );
                  }

                  return (
                    <div className={cn("p-2 h-full", rowBg)}>
                      {renderImageCell(getImageDataByIndex(cell))}
                    </div>
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}